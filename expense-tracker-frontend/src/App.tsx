import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { LoginForm } from "./components/login-form";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<div>Register Page</div>} />
        </Route>
        <Route path="/dashboard" element={<PrivateRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

