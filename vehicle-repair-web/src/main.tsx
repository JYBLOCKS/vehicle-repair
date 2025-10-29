import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { AuthContextProvider } from "./middlewares/AuthContext";
import PrivateRoute from "./middlewares/PrivateRoute";
import { Login, NotFoundPage, Register } from "./pages";
import { routes } from "./routes";
import { AppThemeProvider } from "./theme/ThemeProvider";

const publicRoutes = [
  { path: routes.home, element: <App /> },
  { path: routes.login, element: <Login /> },
  { path: routes.register, element: <Register /> },
];

const privateRoutes: {
  path: string;
  element: JSX.Element;
}[] = [];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <AppThemeProvider>
        <BrowserRouter>
          <Routes>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            <Route element={<PrivateRoute />}>
              {privateRoutes.length > 0 &&
                privateRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
            </Route>

            <Route path={routes.notFound} element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppThemeProvider>
    </AuthContextProvider>
  </StrictMode>
);
