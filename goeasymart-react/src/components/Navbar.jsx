import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import logo from '../assets/logo.svg';

const Navbar = () => {

  const collapseRef = useRef(null);

  const closeMenu = () => {
    const collapseElement = collapseRef.current;

    if (!collapseElement) return;

    // Bootstrap instance get cheyyadam
    const bsCollapse = Collapse.getInstance(collapseElement);

    if (bsCollapse) {
      bsCollapse.hide(); // smooth close
    } else {
      // fallback (rare case)
      collapseElement.classList.remove('show');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '80px', objectFit: 'contain' }}
          />
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={collapseRef}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={closeMenu}>
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/markets" onClick={closeMenu}>
                Markets
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/process" onClick={closeMenu}>
                How It Works
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/worldmap" onClick={closeMenu}>
                Reach
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="btn ms-lg-3"
                to="/contact"
                onClick={closeMenu}
                style={{
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  color: 'var(--deep)',
                  fontWeight: '600',
                  borderRadius: '8px',
                  padding: '8px 18px'
                }}
              >
                Get Quote
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;