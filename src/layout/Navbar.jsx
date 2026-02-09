import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <header id="navbar">
      <nav className="nav-inner">
        <NavLink to="/">Home</NavLink>

        {/* Only when logged in */}
        {token ? (
          <>
            <NavLink to="/find-foragers">Find Foragers</NavLink>
            <NavLink to="/create">Create Find</NavLink>
            <NavLink to="/my-finds">My Finds</NavLink>
            <button onClick={logout} className="nav-logout">
              Log out
            </button>
          </>
        ) : (
          // availabe when logged out
          <div className="nav-right">
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
