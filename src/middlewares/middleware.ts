import type { FreshContext } from "../../deps.ts";
import type { PlantationInnerParams } from "../../types.ts";

export function getPlantationMiddleware({
  auth,
  paths,
  resourceName,
  loginAfterPath,
  isAllowNoSessionPath,
  isSessionLogicPath,
}: PlantationInnerParams) {
  return async function (req: Request, ctx: FreshContext) {
    if (ctx.destination !== "route") {
      return await ctx.next();
    }

    const pathname = new URL(req.url).pathname;
    const authRequest = auth.handleRequest(req);
    const session = await authRequest.validate();

    if (isSessionLogicPath(pathname)) {
      if (session) {
        return new Response("Authorized", {
          status: 302,
          headers: { Location: loginAfterPath },
        });
      } else {
        return await ctx.next();
      }
    } else {
      if (!isAllowNoSessionPath(pathname) && !session) {
        return new Response("Unauthorized", {
          status: 302,
          headers: { Location: paths.loginPath },
        });
      }
    }

    if (session) {
      ctx.state[`auth${resourceName}Session`] = session;
    }
    return await ctx.next();
  };
}
