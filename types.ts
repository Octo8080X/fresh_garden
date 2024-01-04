import { Handlers, PageProps } from "./deps.ts";
import { type Auth, type JSX, WithCsrf, z } from "./deps.ts";

export interface PlantationParams {
  auth: Auth;
  setupRootPath: string;
  allowNoSessionPaths: (string | RegExp)[];
  loginAfterPath: string;
  logoutAfterPath: string;
  resourceIdentifierName: string;
  resourceName: string;
  identifierSchema: z.ZodString;
  passwordSchema: z.ZodString;
}

export interface PlantationInnerParams {
  auth: Auth;
  loginAfterPath: string;
  logoutAfterPath: string;
  resourceIdentifierName: string;
  resourceName: string;
  paths: {
    loginPath: string;
    createPath: string;
    logoutPath: string;
  };
  isAllowNoSessionPath: { (path: string): boolean };
  isSessionLogicPath: { (path: string): boolean };
  identifierSchema: z.ZodString;
  passwordSchema: z.ZodString;
}

export type PlantationRouteAction = "create" | "login" | "logout";
export type PlantationHandlerAction = PlantationRouteAction;
export type PlantationComponentAction = Exclude<
  PlantationRouteAction,
  "logout"
>;
export interface DefaultActions {
  create: {
    getHandler: (
      { auth, loginAfterPath, logoutAfterPath, resourceName, paths }:
        PlantationInnerParams,
    ) => Handlers<unknown, WithCsrf>;
    getComponent: (
      { resourceIdentifierName, paths }: PlantationInnerParams,
    ) => (
      { data, state }: PageProps<
        { errors: string[]; identifier: string },
        WithCsrf
      >,
    ) => JSX.Element;
  };
  login: {
    getHandler: (
      { auth, loginAfterPath, logoutAfterPath, resourceName }:
        PlantationInnerParams,
    ) => Handlers<unknown, WithCsrf>;
    getComponent: (
      { resourceIdentifierName, paths }: PlantationInnerParams,
    ) => (
      { data, state }: PageProps<
        { errors: string[]; identifier: string },
        WithCsrf
      >,
    ) => JSX.Element;
  };
  logout: {
    getHandler: (
      { auth, loginAfterPath, logoutAfterPath, resourceName, paths }:
        PlantationInnerParams,
    ) => Handlers<unknown, WithCsrf>;
  };
}

type IdName<T extends string> = `${T}Id`;
type LuciaObjectKey<T extends string> = `auth${Capitalize<T>}Session`;

export interface WithPlantation<Q extends string>
  extends Record<string, unknown> {
  plantation: {
    [K in LuciaObjectKey<Q>]:
      & {
        [KK in Q]: {
          [KKK in IdName<Q>]: string;
        };
      }
      & { resourceName: string };
  };
}
