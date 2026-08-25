import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

function Navbar() {
  // NavLink automatically adds an "active" class when the route matches,
  // so we can highlight whichever page the user is currently on.
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8 8.5h16M8 15.9h11M8 23.5h16" />
              <path d="M12 5v22" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>Budget Tracker</strong>
            <small>financial overview</small>
          </span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={linkClass}>
            New Entry
          </NavLink>
          <NavLink to="/summary" className={linkClass}>
            Summary
          </NavLink>
        </nav>

        {/* Global theme toggle, now wired up via Context API */}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
