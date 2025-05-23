import { Navigate } from "react-router";
import { useContext, ReactNode } from "react";
import { UserContext } from "./UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user,loading } = useContext(UserContext);

  const isUserLoggedIn = !!user?.id;

  if (loading){
    return <div>Loading...</div>;
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/user/login" replace />;
  }

  return <>{children}</>;
};