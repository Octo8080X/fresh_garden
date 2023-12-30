import { type CsrfOption, getCsrfPlugin, type Plugin } from "../deps.ts";
import { DefaultActions, PlantationParams } from "../types.ts";
import { getCreateComponent, getCreateHandler } from "../routes/create.tsx";
import { getLoginComponent, getLoginHandler } from "../routes/login.tsx";
import { getLogoutHandler } from "../routes/logout.tsx";

import { getPlantationMiddleware } from "../middlewares/middleware.ts";
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

export async function getPlantationPlugin(
  plantationParams: PlantationParams,
): Promise<Plugin> {
  const plantationInnerParams = getInnerParams(plantationParams);

  return {
    name: "plantation",
    middlewares: [
      {
        middleware: {
          handler: getPlantationMiddleware(plantationInnerParams),
        },
        path: plantationParams.setupRootPath,
      },
    ],
    routes: [
      await getCreateRoute(plantationInnerParams, defaultActions),
      await getLoginRoute(plantationInnerParams, defaultActions),
      await getLogoutRoute(plantationInnerParams, defaultActions),
    ],
  };
}

export async function getPlantationWithCsrfPlugins(
  { csrf, plantationParams }: {
    csrf: { kv: Deno.Kv; csrfOption?: Partial<CsrfOption> | undefined };
    plantationParams: PlantationParams;
  },
) {
  return [
    await getCsrfPlugin(csrf.kv, csrf.csrfOption),
    await getPlantationPlugin(plantationParams),
  ];
}
