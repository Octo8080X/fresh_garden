import { PlantationInnerParams, PlantationParams } from "../../types.ts";
import { getPathMatchByPathsAndRegExps } from "./pathMatch.ts";

export function getInnerParams(
  plantationParams: PlantationParams,
): PlantationInnerParams {
  const { resourceName, allowNoSessionPaths, ...innerParams } =
    plantationParams;
  const createPath = `/${resourceName}/create`;
  const loginPath = `/${resourceName}/login`;
  const logoutPath = `/${resourceName}/logout`;

  const isAllowNoSessionPath = getPathMatchByPathsAndRegExps(
    allowNoSessionPaths,
  );
  const isSessionLogicPath = getPathMatchByPathsAndRegExps([
    createPath,
    loginPath,
  ]);

  return {
    ...innerParams,
    resourceName,
    paths: {
      createPath,
      loginPath,
      logoutPath,
    },
    isAllowNoSessionPath,
    isSessionLogicPath,
  };
}
