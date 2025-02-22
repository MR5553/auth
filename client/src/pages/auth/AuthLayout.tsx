import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";

type Routes = "PUBLIC" | "PRIVATE";

export function Router({ RouteType }: { RouteType: Routes }) {
    const { isAuthenticated, user, getProfile } = useAuthStore((state) => state);
    const location = useLocation();

    useEffect(() => {
        getProfile()
    }, [getProfile]);

    if (RouteType === "PUBLIC") {
        if (isAuthenticated && user.is_verified) {
            return <Navigate to="/" state={{ from: location }} replace />;
        }
        return <Outlet />
    }

    if (RouteType === "PRIVATE") {
        if (!isAuthenticated) {
            return <Navigate to="/sign-in" state={{ from: location }} replace />;
        }

        if (!user?.is_verified) {
            return <Navigate to={`/verify-email/${user._id}`} state={{ from: location }} replace />;
        }
        return <Outlet />;
    }

    return <Navigate to="*" replace />;

}