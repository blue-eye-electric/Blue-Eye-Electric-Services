import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { validateToken, type UserRole } from "../services/authService";
import PageLoader from "../atoms/PageLoader";

type ProtectedRouteProps = {
  role: UserRole;
  children: ReactNode;
};

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const result = await validateToken();

        if (isMounted) {
          setIsAuthorized(result.valid && result.role === role);
        }
      } catch {
        if (isMounted) {
          setIsAuthorized(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [role]);

  if (isChecking) {
    return <PageLoader />;
  }

  if (!isAuthorized) {
    localStorage.removeItem("token");
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
