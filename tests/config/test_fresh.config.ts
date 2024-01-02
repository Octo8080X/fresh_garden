/// <reference lib="deno.unstable" />
import { defineConfig } from "$fresh/server.ts";
import { testPlugin } from "../plugins/test_plugin.ts";

import { getPlantationWithCsrfPlugins } from "../../mod.ts";
import { auth, connectionPool } from "../utils/auth.ts";
export { connectionPool };
import { z } from "../../deps.ts";

const testEmailSchema = z.coerce.string().email();
const testPasswordSchema = z.coerce.string().trim().min(8);

export default defineConfig({
  plugins: [
    ...(await getPlantationWithCsrfPlugins(
      {
        csrf: {
          kv: await Deno.openKv(":memory:"),
        },
        plantationParams: {
          setupRootPath: "/",
          auth: auth,
          allowNoSessionPaths: [],
          resourceName: "user",
          resourceIdentifierName: "email",
          loginAfterPath: "/must_login",
          logoutAfterPath: "/",
          identifierSchema: testEmailSchema,
          passwordSchema: testPasswordSchema,
        },
      },
    )),
    testPlugin,
  ],
});
