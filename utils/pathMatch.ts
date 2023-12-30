import { PlantationRouteAction } from "../types.ts";

export function getPathMatchByPathsAndRegExps(
  pathAndRegExps: (RegExp | string)[],
) {
  const {
    object: regExps,
    string: paths,
  }: { object: RegExp[]; string: string[] } = Object.groupBy(
    pathAndRegExps,
    (p: RegExp | string) => typeof p,
  ) as { object: RegExp[]; string: string[] };

  return getPathMatch([...paths || []], [...regExps || []]);
}

function getPathMatch(paths: string[], regExps: RegExp[]) {
  return function (path: string) {
    const resultPathsMatch = paths.includes(path);
    const resultRegExpsMatch = regExps.some((p) => p.test(path));

    return resultPathsMatch || resultRegExpsMatch;
  };
}

export function getCustomFilePath(
  resourceName: string,
  action: PlantationRouteAction,
): string {
  const mainModulePaths = Deno.mainModule.split("/");
  mainModulePaths.pop();
  return mainModulePaths.join("/") +
    `/plantation/${resourceName}/${action}.tsx`;
}
