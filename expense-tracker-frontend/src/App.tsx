import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./features/auth/components/ProtectedRoutes";
import { AuthProvider } from "./features/auth/components/AuthProvider";
import PublicRoute from "./features/auth/components/PublicRoute";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import ExpenseDashboard from "./features/expenses/components/ExpenseDashboard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
            </Route>
          </Routes>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ExpenseDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

