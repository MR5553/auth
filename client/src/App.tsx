import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import { useTheme } from "./hook/useTheme";
import AuthLayout from "./pages/AuthLayout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
const SignIn = lazy(() => (import("./pages/Sign-in")));
const Signup = lazy(() => (import("./pages/Sign-up")));
const Verifyemail = lazy(() => (import("./pages/Verifyemail")));


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/verifyemail/:id",
        element: <Verifyemail />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ]
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  useTheme();

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}