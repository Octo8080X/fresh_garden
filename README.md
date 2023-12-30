[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

# Plantation

Authentication plugin for Fresh(Deno) using Lucia.
Plantation is inspired by [devise](https://github.com/heartcombo/devise).

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

## Custom handler and component

You can use the cli tool to build your own handlers and components.

```sh
$ deno run --allow-write --allow-net https://deno.land/x/plantation/cli.ts user
Create File: ./plantation/user/create.tsx
Create File: ./plantation/user/login.tsx
Create File: ./plantation/user/logout.tsx
```

When using the user resource, set `resourceName: "user"`.
At this time, if plantation/user/create.tsx(login.tsx, logout.tsx) is available, it is referenced first.

Use this for your own customization of CSS or for more detailed customization.

