import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";

type Routes = "PUBLIC" | "PRIVATE" | "VERIFYEMAIL";

export function Router({ RouteType }: { RouteType: Routes }) {
    const { isAuthenticated, user, getProfile } = useAuthStore((state) => state);
    const location = useLocation();

    useEffect(() => {
        getProfile()
    }, [getProfile]);

    if (RouteType === "PUBLIC") {
        return (isAuthenticated && user?.is_verified) ? <Navigate to="/" replace /> : <Outlet />;
    }

    if (RouteType === "PRIVATE") {
        if (!isAuthenticated) {
            return <Navigate to="/sign-in" state={{ from: location }} replace />;
        }
        if (!user?.is_verified) {
            return <Navigate to="/verify-email" state={{ from: location }} replace />;
        }
        return <Outlet />;
    }

    if (RouteType === "VERIFYEMAIL") {
        if (!isAuthenticated) {
            return <Navigate to="/sign-in" state={{ from: location }} replace />;
        }
        if (user?.is_verified) {
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    }

    return <Navigate to="*" replace />;

}