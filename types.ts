import { Handlers, PageProps } from "./deps.ts";
import { type Auth, type JSX, WithCsrf, z } from "./deps.ts";

export interface GardenParams {
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

export interface GardenInnerParams {
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

export type GardenRouteAction = "create" | "login" | "logout";
export type GardenHandlerAction = GardenRouteAction;
export type GardenComponentAction = Exclude<
  GardenRouteAction,
  "logout"
>;
export interface DefaultActions {
  create: {
    getHandler: (
      { auth, loginAfterPath, logoutAfterPath, resourceName, paths }:
        GardenInnerParams,
    ) => Handlers<unknown, WithCsrf>;
    getComponent: (
      { resourceIdentifierName, paths }: GardenInnerParams,
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
        GardenInnerParams,
    ) => Handlers<unknown, WithCsrf>;
    getComponent: (
      { resourceIdentifierName, paths }: GardenInnerParams,
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
        GardenInnerParams,
    ) => Handlers<unknown, WithCsrf>;
  };
}

type IdName<T extends string> = `${T}Id`;
type LuciaObjectKey<T extends string> = `auth${Capitalize<T>}Session`;

export interface WithGarden<Q extends string> extends Record<string, unknown> {
  garden: {
    [K in LuciaObjectKey<Q>]:
      & {
        [KK in Q]: {
          [KKK in IdName<Q>]: string;
        };
      }
      & { resourceName: string };
  };
}
