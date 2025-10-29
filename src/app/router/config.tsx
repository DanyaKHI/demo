/* eslint-disable react-refresh/only-export-components */
import { ComponentType, lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { RoutePaths } from "./constants";
import { Center, Loader } from "@mantine/core";
import { RootLayout } from "../RootLayout";

const SummaryPage = lazy(() => import("@/pages/SummaryPage/SummaryPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage/PortfolioPage"));
const TransactionsPage = lazy(() => import("@/pages/TransactionsPage/TransactionsPage"));
const StructurePage = lazy(() => import("@/pages/StructurePage/StructurePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));


const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<Center><Loader type="dots" size="xl"/></Center>}>
    <Component />
  </Suspense>
);

export const getConfig = () => [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={RoutePaths.SUMMARY} replace />,
      },
      {
        path: RoutePaths.SUMMARY,
        element: withSuspense(SummaryPage)
      },
      {
        path: RoutePaths.POTRFOLIO,
        element: withSuspense(PortfolioPage)
      },
      {
        path: RoutePaths.TRANSACTIONS,
        element: withSuspense(TransactionsPage)
      },
      {
        path: RoutePaths.STRUCTURE,
        element: withSuspense(StructurePage)
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFoundPage)
  },
];
