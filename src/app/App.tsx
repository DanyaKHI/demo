import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "@/app/router";
import { logEnv } from "@/shared/config/env/logEnv";
import "./index.css";

logEnv();

const router = createRouter();

export const App = () => {
  return (
    <MantineProvider defaultColorScheme="dark">
        <RouterProvider router={router} />
    </MantineProvider>
  );
};
