# Plantation 🍋

Authentication plugin for Fresh(Deno) using Lucia.

Plantation is inspired by [devise](https://github.com/heartcombo/devise).
Combining plantation with fresh provides the ability to create accounts, log in
and log out.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

# Usage

## fresh.config.ts

```ts
import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import {
  emailSchema,
  getPlantationWithCsrfPlugins,
  passwordSchema,
} from "plantation/mod.ts";
import { auth } from "./utils/lucia.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    ...(await getPlantationWithCsrfPlugins(
      {
        csrf: {
          kv: await Deno.openKv(),
          encryptKey: Deno.env.get("FRESH_CSRF_ENCRYPT_KEY")!, // <= string length of 32, ex. 12345678901234567890123456789012
          key: Deno.env.get("FRESH_CSRF_KEY")!, // <= string length of 32, ex. 01234567012345670123456701234567
          salt: Number(Deno.env.get("FRESH_CSRF_SALT!")!), // ex. 123
        },
        plantationParams: {
          setupRootPath: "/",
          auth: auth,
          allowNoSessionPaths: [],
          resourceName: "user",
          resourceIdentifierName: "email",
          loginAfterPath: "/must_login",
          logoutAfterPath: "/",
          identifierSchema: emailSchema,
          passwordSchema: passwordSchema,
        },
      },
    )),
  ],
});
```

## Permission

- read
- write(when doing cli)

## Use of authentication information

`user` Resource authenticated information can be obtained as follows.

```ts
import { LogoutForm } from "../../mod.ts";
import type { WithPlantation } from "../../mod.ts";
import type { PageProps } from "$fresh/server.ts";

export default function MustLogin(
  props: PageProps<unknown, WithPlantation<"user">>,
) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        MUST LOGIN
        <p>
          {props.state.plantation.authUserSession.resourceName}
          id :{props.state.plantation.authUserSession.user.userId}
        </p>
      </div>
    </div>
  );
}
```

In the case of `user`, the ID of the resource can be obtained as in
`props.state.plantation.authUserSession.user.userId`.\
Similarly, the handler can also retrieve this.

```ts
export const handler = {
  GET(req: Request, ctx: FreshContext<WithPlantation<"user">>) {
    // ex. get user id
    // ctx.state.plantation.authUserSession.user.userId

    return ctx.render();
  },
};
```

## Custom handler and component

You can use the cli tool to build your own handlers and components.

```sh
$ deno run --allow-write --allow-net https://deno.land/x/plantation/cli.ts user
Create File: ./plantation/user/create.tsx
Create File: ./plantation/user/login.tsx
Create File: ./plantation/user/logout.tsx
Please add "(async () => await import('./plantation/extra_loader.ts'));" to your main.ts
```

When using the user resource, set `resourceName: "user"`.\
At this time, if plantation/user/create.tsx(login.tsx, logout.tsx) is available,
it is referenced first.

Use this for your own customization of CSS or for more detailed customization.
