import { Navigate } from "react-router";
import { routes } from "../routes";
import { useAuth } from "./AuthContext";

function PrivateRoute() {
  const localStorageUser = JSON.parse(localStorage.getItem("auth") || "{}");
  const { user } = useAuth();

  if (!user?.email || !localStorageUser?.access_token) {
    return <Navigate to={routes.login} replace={true} state={{ from: "/" }} />;
  }
}
export default PrivateRoute;
