/** @jsx h */
import {
  FreshContext,
  h,
  Handlers,
  LuciaError,
  PageProps,
  pascalCase,
  PASSWORD,
  PlantationInnerParams,
  stringValidate,
  styles,
  WithCsrf,
} from "https://raw.githubusercontent.com/Octo8080X/plantation/main/templateDeps.ts";

export function getLoginHandler(
  { auth, loginAfterPath, resourceIdentifierName, paths }:
    PlantationInnerParams,
): Handlers<unknown, WithCsrf> {
  return {
    async POST(req: Request, ctx: FreshContext<WithCsrf>) {
      const formData = await req.formData();
      const token = formData.get("csrf");

      if (!ctx.state.csrf.csrfVerifyFunction(token?.toString() ?? null)) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: paths.loginPath,
          },
        });
      }

      const identifier = formData.get(resourceIdentifierName);
      const password = formData.get("password");

      const identifierResult = stringValidate(
        resourceIdentifierName,
        identifier?.toString(),
      );
      const passwordResult = stringValidate("password", password?.toString());

      if (!(identifierResult.success && passwordResult.success)) {
        return ctx.render({
          errors: [...identifierResult.errors, ...passwordResult.errors],
          identifier,
        });
      }

      try {
        const key = await auth.useKey(
          resourceIdentifierName,
          identifierResult.data,
          passwordResult.data,
        );
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {},
        });
        const sessionCookie = auth.createSessionCookie(session);
        return new Response(null, {
          headers: {
            Location: loginAfterPath,
            "Set-Cookie": sessionCookie.serialize(),
          },
          status: 302,
        });
      } catch (e) {
        console.error("e", e);
        if (
          e instanceof LuciaError &&
          ["AUTH_INVALID_KEY_ID", "AUTH_INVALID_PASSWORD"].includes(e.message)
        ) {
          return ctx.render({
            errors: ["Incorrect username or password"],
            identifier,
          });
        }
        throw new LuciaError("AUTH_INVALID_KEY_ID");
      }
    },
  };
}

export function getLoginComponent(
  { paths, resourceIdentifierName }: PlantationInnerParams,
) {
  return function (
    { data, state }: PageProps<
      { errors: string[]; identifier: string },
      WithCsrf
    >,
  ) {
    return (
      <div style={styles.block}>
        <div>
          <h2>LOGIN</h2>
        </div>
        <div>
          <form action={paths.loginPath} method="post">
            <input type="hidden" name="csrf" value={state.csrf.getTokenStr()} />
            <div style={styles.row}>
              {data?.errors?.length > 0 && (
                <ul>
                  {data.errors.map((error) => <li>{error}</li>)}
                </ul>
              )}
            </div>
            <div style={styles.row}>
              <label for={resourceIdentifierName} style={styles.label}>
                {pascalCase(resourceIdentifierName)}
              </label>
              <input
                type="text"
                id={resourceIdentifierName}
                name={resourceIdentifierName}
                style={styles.textbox}
                value={data?.identifier}
              />
            </div>
            <div style={styles.row}>
              <label for="password" style={styles.label}>Password</label>
              <input
                type="password"
                id={PASSWORD}
                name={PASSWORD}
                style={styles.textbox}
              />
            </div>
            <div style={styles.row}>
              <button type="submit" style={styles.button}>Login</button>
            </div>
          </form>
        </div>
        <div>
          <a href={paths.createPath} style={styles.link}>Create Account</a>
        </div>
      </div>
    );
  };
}
