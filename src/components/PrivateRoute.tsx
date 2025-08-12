//  PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("accessToken"); // ✅ Corrected

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
