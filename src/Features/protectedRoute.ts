import { useSelector } from "react-redux";
import { RootState } from "../Features/Store";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { persistor } from "../Features/Store"; // Import persistor

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.credentials.Email && !!state.credentials.Password
  );
  const router = useRouter();

  useEffect(() => {
    // if (!persistor.getState().status !== "rehydrated") return; // Wait for Redux Persist to rehydrate state
    if (!isAuthenticated) {
      router.push("/login"); // Redirect if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }

  return children;
};

export default ProtectedRoute;
