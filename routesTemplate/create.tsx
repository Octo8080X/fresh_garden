import {
  FreshContext,
  LuciaError,
  PageProps,
  pascalCase,
  PASSWORD,
  PlantationInnerParams,
  sameLogicValidate,
  styles,
  WithCsrf,
} from "https://deno.land/x/plantation/templateDeps.ts";
export function getCreateHandler(
  {
    auth,
    loginAfterPath,
    resourceIdentifierName,
    identifierSchema,
    passwordSchema,
  }: PlantationInnerParams,
) {
  return {
    async POST(req: Request, ctx: FreshContext<WithCsrf>) {
      const formData = await req.formData();
      const token = formData.get("csrf");

      if (!ctx.state.csrf.csrfVerifyFunction(token?.toString() ?? null)) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: req.headers.get("referer") || "/",
          },
        });
      }

      const identifier = formData.get(resourceIdentifierName);
      const password = formData.get(PASSWORD);

      const identifierResult = sameLogicValidate(
        resourceIdentifierName,
        identifier?.toString(),
        identifierSchema,
      );
      const passwordResult = sameLogicValidate(
        "password",
        password?.toString(),
        passwordSchema,
      );

      if (!(identifierResult.success && passwordResult.success)) {
        return ctx.render({
          errors: [...identifierResult.errors, ...passwordResult.errors],
          identifier,
        });
      }

      try {
        const user = await auth.createUser({
          key: {
            providerId: resourceIdentifierName,
            providerUserId: identifierResult.data,
            password: passwordResult.data,
          },
          attributes: {
            [resourceIdentifierName]: identifierResult.data,
          },
        });
        const session = await auth.createSession({
          userId: user.userId,
          attributes: {},
        });
        const sessionCookie = auth.createSessionCookie(session);

        return new Response(null, {
          headers: {
            Location: loginAfterPath,
            "Set-Cookie": sessionCookie.serialize(), // store session cookie
          },
          status: 302,
        });
      } catch (e) {
        console.error("e", e);
        if (e instanceof LuciaError) {
          return ctx.render({
            errors: ["Auth system error"],
            identifier,
          });
        }
        return new Response("An unknown error occurred", {
          status: 500,
        });
      }
    },
    async GET(req: Request, ctx: FreshContext<WithCsrf>) {
      ctx.state.csrf.updateKeyPair();
      return await ctx.render();
    },
  };
}

export function getCreateComponent(
  { resourceIdentifierName, paths }: PlantationInnerParams,
) {
  return function (
    { data, state }: PageProps<
      { errors: string[]; identifier: string },
      WithCsrf
    >,
  ) {
    return (
      <div style={styles.block}>
        <div style={styles.container}>
          <div style={styles.centering}>
            <h2>Custom Create Account</h2>
          </div>
          <div>
            <form action={paths.createPath} method="post">
              <input
                type="hidden"
                name="csrf"
                value={state.csrf.getTokenStr()}
              />
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
              <div style={{ ...styles.row, ...styles.centering }}>
                <button type="submit" style={styles.button}>Create</button>
              </div>
            </form>
          </div>
          <div style={styles.centering}>
            <a href={paths.loginPath} style={styles.link}>Login</a>
          </div>
        </div>
      </div>
    );
  };
}
