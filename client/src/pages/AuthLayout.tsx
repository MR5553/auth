import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function AuthLayout() {
    const { isAuthenticated, user } = useAuthStore((state) => state);

    if (!user?.is_verified && user?.profile_info?.email) {
        return <Navigate to={`/verifyemail/${user._id}`} replace />;
    }

    if (!isAuthenticated && !user?.is_verified) {
        return (
            <Navigate to="/sign-up" replace />
        )
    }

    return <Outlet />
}