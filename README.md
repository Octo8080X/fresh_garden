# Fresh Garden 🍋

Authentication plugin for Fresh(Deno) using Lucia.

Fresh Garden is inspired by [devise](https://github.com/heartcombo/devise).
Combining garden with fresh provides the ability to create accounts, log in and
log out.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

# Demo Site

[garden-demo.deno.dev](https://garden-demo.deno.dev/)

# Usage

## fresh.config.ts

```ts
import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import {
  emailSchema,
  getGardenWithCsrfPlugins,
  passwordSchema,
} from "garden/mod.ts";
import { auth } from "./utils/lucia.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    ...(await getGardenWithCsrfPlugins(
      {
        csrf: {
          kv: await Deno.openKv(),
          encryptKey: Deno.env.get("FRESH_CSRF_ENCRYPT_KEY")!, // <= string length of 32, ex. 12345678901234567890123456789012
          key: Deno.env.get("FRESH_CSRF_KEY")!, // <= string length of 32, ex. 01234567012345670123456701234567
          salt: Number(Deno.env.get("FRESH_CSRF_SALT!")!), // ex. 123
        },
        gardenParams: {
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
import type { WithGarden } from "../../mod.ts";
import type { PageProps } from "$fresh/server.ts";

export default function MustLogin(
  props: PageProps<unknown, WithGarden<"user">>,
) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        MUST LOGIN
        <p>
          {props.state.garden.authUserSession.resourceName}
          id :{props.state.garden.authUserSession.user.userId}
        </p>
      </div>
    </div>
  );
}
```

In the case of `user`, the ID of the resource can be obtained as in
`props.state.garden.authUserSession.user.userId`.\
Similarly, the handler can also retrieve this.

```ts
export const handler = {
  GET(req: Request, ctx: FreshContext<WithGarden<"user">>) {
    // ex. get user id
    // ctx.state.garden.authUserSession.user.userId

    return ctx.render();
  },
};
```

## Custom handler and component

You can use the cli tool to build your own handlers and components.

```sh
$ deno run --allow-write --allow-net https://deno.land/x/garden/cli.ts user
Create File: ./garden/user/create.tsx
Create File: ./garden/user/login.tsx
Create File: ./garden/user/logout.tsx
Please add "(async () => await import('./garden/extra_loader.ts'));" to your main.ts
```

When using the user resource, set `resourceName: "user"`.\
At this time, if garden/user/create.tsx(login.tsx, logout.tsx) is available, it
is referenced first.

Use this for your own customization of CSS or for more detailed customization.
