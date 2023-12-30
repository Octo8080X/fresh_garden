import {
  FreshContext,
  Handlers,
  PlantationInnerParams,
  WithCsrf,
} from "https://raw.githubusercontent.com/Octo8080X/plantation/main/templateDeps.ts";

export function getLogoutHandler(
  { auth, loginAfterPath, logoutAfterPath, resourceName }:
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
        return new Response("Unauthorized", {
          status: 302,
          headers: {
            Location: logoutAfterPath,
          },
        });
      } else {
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
