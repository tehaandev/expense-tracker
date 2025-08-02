import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./features/auth/components/ProtectedRoutes";
import { AuthProvider } from "./features/auth/components/AuthProvider";
import PublicRoute from "./features/auth/components/PublicRoute";
import LoginForm from "./components/login-form";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<div>Register Page</div>} />
          </Route>
        </Routes>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Dashboard Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

