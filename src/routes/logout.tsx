import {
  FreshContext,
  Handlers,
  setCookie,
  WithCsrf,
} from "../../deps.ts";
import { PlantationInnerParams } from "../../types.ts";

export function getLogoutHandler(
  { auth, logoutAfterPath }:
    PlantationInnerParams,
): Handlers<unknown, WithCsrf> {
  return {
    async POST(req: Request, ctx: FreshContext<WithCsrf>) {
      const form = await req.formData();
      const token = form.get("csrf");

      if (!ctx.state.csrf.csrfVerifyFunction(token?.toString() ?? null)) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: req.headers.get("referer") || "/",
          },
        });
      }

      const authRequest = auth.handleRequest(req);
      const session = await authRequest.validate();
      if (session) {
        auth.invalidateSession(session.sessionId);

        const headers = new Headers(
          {
            Location: logoutAfterPath,
          },
        );

        setCookie(headers, {
          name: "auth_session",
          value: "",
          httpOnly: true,
          path: "/",
          maxAge: 0,
        });

        return new Response("Unauthorized", {
          status: 302,
          headers,
        });
      } else {
        ctx.state.csrf.updateKeyPair();
        return new Response("Unauthorized", {
          status: 302,
          headers: {
            Location: req.headers.get("referer") || "/",
          },
        });
      }
    },
  };
}
