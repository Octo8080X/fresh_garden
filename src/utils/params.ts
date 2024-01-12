import { GardenInnerParams, GardenParams } from "../../types.ts";
import { getPathMatchByPathsAndRegExps } from "./pathMatch.ts";

export function getInnerParams(
  gardenParams: GardenParams,
): GardenInnerParams {
  const { resourceName, allowNoSessionPaths, ...innerParams } =
    gardenParams;
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
