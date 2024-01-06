import { FreshContext, Handlers, WithCsrf, deleteCookie } from "../../deps.ts";
import { PlantationInnerParams } from "../../types.ts";

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
        const headers = {
          Location: logoutAfterPath,
        }

        deleteCookie(headers, "auth_session");

        return new Response("Unauthorized", {
          status: 302,
          headers
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
