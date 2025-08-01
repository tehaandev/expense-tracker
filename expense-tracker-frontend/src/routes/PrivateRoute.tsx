import { Outlet } from "react-router";

export default function PrivateRoute() {
  return (
    <div className="">
      <Outlet />
    </div>
  );
}

