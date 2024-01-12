/// <reference lib="deno.unstable" />
import { type CsrfOption, getCsrfPlugin, type Plugin } from "../../deps.ts";
import { DefaultActions, GardenParams } from "../../types.ts";
import { getCreateComponent, getCreateHandler } from "../routes/create.tsx";
import { getLoginComponent, getLoginHandler } from "../routes/login.tsx";
import { getLogoutHandler } from "../routes/logout.tsx";

import { getGardenMiddleware } from "../middlewares/middleware.ts";
import { getInnerParams } from "../utils/params.ts";
import {
  getCreateRoute,
  getLoginRoute,
  getLogoutRoute,
} from "../utils/route.ts";

const defaultActions: DefaultActions = {
  create: {
    getHandler: getCreateHandler,
    getComponent: getCreateComponent,
  },
  login: {
    getHandler: getLoginHandler,
    getComponent: getLoginComponent,
  },
  logout: {
    getHandler: getLogoutHandler,
  },
};

export async function getGardenPlugin(
  gardenParams: GardenParams,
): Promise<Plugin> {
  const gardenInnerParams = getInnerParams(gardenParams);

  return {
    name: "garden",
    middlewares: [
      {
        middleware: {
          handler: getGardenMiddleware(gardenInnerParams),
        },
        path: gardenParams.setupRootPath,
      },
    ],
    routes: [
      await getCreateRoute(gardenInnerParams, defaultActions),
      await getLoginRoute(gardenInnerParams, defaultActions),
      await getLogoutRoute(gardenInnerParams, defaultActions),
    ],
  };
}

export async function getGardenWithCsrfPlugins(
  { csrf, gardenParams }: {
    csrf: { kv: Deno.Kv; csrfOption?: Partial<CsrfOption> | undefined };
    gardenParams: GardenParams;
  },
) {
  return [
    await getCsrfPlugin(csrf.kv, csrf.csrfOption),
    await getGardenPlugin(gardenParams),
  ];
}
