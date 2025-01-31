import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTheme } from "./hook/useTheme";

const SignIn = lazy(() => (import("./pages/auth/Sign-in")));
const Signup = lazy(() => (import("./pages/auth/Sign-up")));
const Verifyemail = lazy(() => (import("./pages/auth/Verifyemail")));
import Loader from "./components/Loader";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Router } from "./pages/auth/AuthLayout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Router RouteType="PRIVATE" />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "/",
    element: <Router RouteType="PUBLIC" />,
    children: [
      { path: "sign-up", element: <Signup /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "forget-password", element: <SignIn /> },
    ],
  },
  {
    path: "verifyemail/:id",
    element: <Router RouteType="VERIFYEMAIL" />,
    children: [
      { index: true, element: <Verifyemail /> },
    ]
  },
  { path: "*", element: <NotFound /> },
]);


export default function App() {
  useTheme();

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}