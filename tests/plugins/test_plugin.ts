import { PageProps, Plugin } from "$fresh/server.ts";
import TestComponent from "../routes/test_route.tsx";
import { ComponentType } from "preact";

export const testPlugin: Plugin = {
  name: "TestPlugin",
  routes: [
    {
      component: TestComponent as ComponentType<PageProps>,
      path: "/must_login",
    },
  ],
};
