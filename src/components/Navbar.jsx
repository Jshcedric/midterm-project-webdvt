import { NavLink } from "react-router-dom";

function Navbar() {
  // NavLink automatically adds an "active" class when the route matches,
  // so we can highlight whichever page the user is currently on.
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-mark">₱</span>
          <span>Budget Tracker</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={linkClass}>
            Add Transaction
          </NavLink>
          <NavLink to="/summary" className={linkClass}>
            Summary
          </NavLink>
        </nav>

        {/* Theme toggle button will be wired up to Context API in Phase 7 */}
        <button className="theme-toggle-placeholder" disabled>
          🌙
        </button>
      </div>
    </header>
  );
}

export default Navbar;
