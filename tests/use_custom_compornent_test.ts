import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "./work/fresh.gen.ts";
import config from "./config/test_fresh.config.ts";
import { expect } from "./test_deps.ts";

const CONN_INFO: ServeHandlerInfo = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" },
};

Deno.test("Response Test", async (t) => {
  await t.step("/user/login has `Custom Login`", async () => {
    const handler = await createHandler(manifest, config);
    const resp = await handler(
      new Request("http://127.0.0.1/user/login"),
      CONN_INFO,
    );

    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text.includes("Custom Login")).toBe(true);
  });

  await t.step("/user/create has `Custom Create Account`", async () => {
    const handler = await createHandler(manifest, config);
    const resp = await handler(
      new Request("http://127.0.0.1/user/create"),
      CONN_INFO,
    );

    expect(resp.status).toBe(200);
    const text = await resp.text();
    console.log(text);
    expect(text.includes("Custom Create Account")).toBe(true);
  });
});

await Deno.test(
  {
    name: "Login test",
    async fn(t) {
      const handler = await createHandler(manifest, config);
      let csrfCookieToken = "";
      let csrfToken = "";
      let authSession = "";

      await t.step("Create account", async () => {
        let resp = await handler(
          new Request("http://127.0.0.1/user/create"),
          CONN_INFO,
        );

        const text = await resp.text();
        csrfCookieToken = resp.headers
          .get("set-cookie")!
          .split("csrf_token=")[1]
          .split(";")[0];
        csrfToken = text
          .split('<input type="hidden" name="csrf" value="')[1]
          .split('"/')[0];

        const formData = new FormData();
        formData.append("csrf", csrfToken);
        formData.append("email", "test@example.com");
        formData.append("password", "password");

        const headers = new Headers();
        headers.set("cookie", `csrf_token=${csrfCookieToken}`);

        resp = await handler(
          new Request("http://127.0.0.1/user/create", {
            headers,
            method: "POST",
            body: formData,
          }),
          CONN_INFO,
        );

        expect(resp.status).toBe(302);
        expect(resp.headers.get("location")).toBe("/must_login");
      });
      await t.step("Login", async () => {
        const formData = new FormData();
        formData.append("csrf", csrfToken);
        formData.append("email", "test@example.com");
        formData.append("password", "password");

        const headers = new Headers();
        headers.set("cookie", `csrf_token=${csrfCookieToken}`);

        const resp = await handler(
          new Request("http://127.0.0.1/user/login", {
            headers,
            method: "POST",
            body: formData,
          }),
          CONN_INFO,
        );

        expect(resp.status).toBe(302);
        expect(resp.headers.get("location")).toBe("/must_login");
        expect(
          resp.headers.get("set-cookie")!.split("auth_session=")[1].split(
            "; ",
          )[1],
        ).toBe("Path=/");
        authSession =
          resp.headers.get("set-cookie")!.split("auth_session=")[1].split(
            ";",
          )[0];
      });

      await t.step("Logout", async () => {
        const headers = new Headers();
        headers.set("cookie", `auth_session=${authSession}`);

        let resp = await handler(
          new Request("http://127.0.0.1/must_login", {
            headers,
          }),
          CONN_INFO,
        );

        expect(resp.status).toBe(200);
        const text = await resp.text();
        expect(text.includes("MUST LOGIN")).toBe(true);

        const formData = new FormData();
        formData.append("csrf", csrfToken);

        resp = await handler(
          new Request("http://127.0.0.1/user/logout", {
            headers,
            method: "POST",
            body: formData,
          }),
          CONN_INFO,
        );
        expect(resp.status).toBe(302);
        expect(resp.headers.get("location")).toBe("/user/login");
      });
    },
    sanitizeOps: false,
    sanitizeResources: false,
  },
);
