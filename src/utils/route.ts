import {
  existsSync,
  fromFileUrl,
  Handler,
  pascalCase,
  PluginRoute,
} from "../../deps.ts";
import {
  DefaultActions,
  PlantationComponentAction,
  PlantationHandlerAction,
  PlantationInnerParams,
} from "../../types.ts";
import { getCustomFilePath } from "./pathMatch.ts";

export async function getHandler(
  plantationInnerParams: PlantationInnerParams,
  action: PlantationHandlerAction,
  defaultActions: DefaultActions,
): Promise<Handler> {
  const defaultHandler = defaultActions[action].getHandler(
    plantationInnerParams,
  );

  const customFilePath = getCustomFilePath(
    plantationInnerParams.resourceName,
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
        plantationInnerParams,
      );
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  } else {
    console.log(`${customFilePath} is not found. Use default Handler.`);
  }

  return customHandler || defaultHandler;
}

export async function getComponent(
  plantationInnerParams: PlantationInnerParams,
  action: PlantationComponentAction,
  defaultActions: DefaultActions,
): Promise<PluginRoute["component"]> {
  const defaultComponent = defaultActions[action].getComponent(
    plantationInnerParams,
  );

  const customFilePath = getCustomFilePath(
    plantationInnerParams.resourceName,
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
        plantationInnerParams,
      );
    } catch (err) {
      console.error(err.message);
      Deno.exit(1);
    }
  } else {
    console.log(`${customFilePath} is not found. Use default component.`);
  }

  return customComponent || defaultComponent;
}

export async function getCreateRoute(
  plantationInnerParams: PlantationInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: plantationInnerParams.paths.createPath,
    handler: await getHandler(plantationInnerParams, "create", defaultActions),
    component: await getComponent(
      plantationInnerParams,
      "create",
      defaultActions,
    ),
  };
}

export async function getLoginRoute(
  plantationInnerParams: PlantationInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: plantationInnerParams.paths.loginPath,
    handler: await getHandler(plantationInnerParams, "login", defaultActions),
    component: await getComponent(
      plantationInnerParams,
      "login",
      defaultActions,
    ),
  };
}

export async function getLogoutRoute(
  plantationInnerParams: PlantationInnerParams,
  defaultActions: DefaultActions,
): Promise<PluginRoute> {
  return {
    path: plantationInnerParams.paths.logoutPath,
    handler: await getHandler(plantationInnerParams, "logout", defaultActions),
  };
}
