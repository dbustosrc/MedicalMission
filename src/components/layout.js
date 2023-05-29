import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Layout = () => {
    const { user } = useAuth();

    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? null : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          )}
          <li>
            <Link to="/NewPatient">New Patient</Link>
          </li>
          <li>
          <Link to="/PersonsList">Appointments</Link>
          </li>
        </ul>
        <Outlet />
      </div>
    );
};

export default Layout;
