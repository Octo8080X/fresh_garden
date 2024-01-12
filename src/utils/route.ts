import {
  existsSync,
  fromFileUrl,
  Handler,
  pascalCase,
  PluginRoute,
} from "../../deps.ts";
import {
  DefaultActions,
  GardenComponentAction,
  GardenHandlerAction,
  GardenInnerParams,
} from "../../types.ts";
import { getCustomFilePath } from "./pathMatch.ts";

export async function getHandler(
  gardenInnerParams: GardenInnerParams,
  action: GardenHandlerAction,
  defaultActions: DefaultActions,
): Promise<Handler> {
  const defaultHandler = defaultActions[action].getHandler(
    gardenInnerParams,
  );

  const customFilePath = getCustomFilePath(
    gardenInnerParams.resourceName,
    action,
  );

  const isReadableFile = existsSync(fromFileUrl(customFilePath), {
    isReadable: true,
    isDirectory: false,
  });

  let customHandler = null;

  const pascalCaseAction = pascalCase(action);

  if (isReadableFile) {
    console.log(`${customFilePath} is found. Use custom Handler`);
    try {
      const custom = await import(customFilePath);
      if (!custom[`get${pascalCaseAction}Handler`]) {
        throw new Error(
          `get${pascalCaseAction}Handler is not defined in ${customFilePath}`,
        );
      }
      customHandler = custom[`get${pascalCaseAction}Handler`](
        gardenInnerParams,
      );
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  } else {
    console.log(`${customFilePath} is not found. Use default Handler.`);
  }

  return customHandler || defaultHandler;
}

export async function getComponent(
  gardenInnerParams: GardenInnerParams,
  action: GardenComponentAction,
  defaultActions: DefaultActions,
): Promise<PluginRoute["component"]> {
  const defaultComponent = defaultActions[action].getComponent(
    gardenInnerParams,
  );

  const customFilePath = getCustomFilePath(
    gardenInnerParams.resourceName,
    action,
  );

  const isReadableFile = existsSync(fromFileUrl(customFilePath), {
    isReadable: true,
    isDirectory: false,
  });

  let customComponent = null;

  const pascalCaseAction = pascalCase(action);

  if (isReadableFile) {
    console.log(`${customFilePath} is found. Use custom component`);
    try {
      const custom = await import(customFilePath);
      if (!custom[`get${pascalCaseAction}Component`]) {
        throw new Error(
          `get${pascalCaseAction}Component is not defined in ${customFilePath}`,
        );
      }
      customComponent = custom[`get${pascalCaseAction}Component`](
        gardenInnerParams,
      );
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  } else {
    console.log(`${customFilePath} is not found. Use default component.`);
  }

  return customComponent || defaultComponent;
}

export async function getCreateRoute(
  gardenInnerParams: GardenInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: gardenInnerParams.paths.createPath,
    handler: await getHandler(gardenInnerParams, "create", defaultActions),
    component: await getComponent(
      gardenInnerParams,
      "create",
      defaultActions,
    ),
  };
}

export async function getLoginRoute(
  gardenInnerParams: GardenInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: gardenInnerParams.paths.loginPath,
    handler: await getHandler(gardenInnerParams, "login", defaultActions),
    component: await getComponent(
      gardenInnerParams,
      "login",
      defaultActions,
    ),
  };
}

export async function getLogoutRoute(
  gardenInnerParams: GardenInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: gardenInnerParams.paths.logoutPath,
    handler: await getHandler(gardenInnerParams, "logout", defaultActions),
  };
}
