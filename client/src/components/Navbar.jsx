function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🧠 <span>Forma AI</span>
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Claims</li>
        <li>Dashboard</li>
        <li>About</li>
      </ul>

      <button className="login-btn">Login</button>
    </nav>
  );
}

export default Navbar;