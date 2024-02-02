import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { MainPage } from "./pages/export";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ForecastsPage } from "./pages/forecastsPage/forecastPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/:city",
    element: <MainPage />,
  },
  {
    path: "/:city/:step",
    element: <ForecastsPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
