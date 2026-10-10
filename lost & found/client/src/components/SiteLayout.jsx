import { useState } from 'react';
import { Compass, Home, Inbox, Menu, Plus, UserRound, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navClass = ({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`;

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  const hideMobileNav = location.pathname === '/welcome';

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" to="/home" onClick={closeMenu} aria-label="FOUND home">
            <span className="site-brand-mark"><Compass size={19} /></span>
            <span>FOUND<small>CAMPUS LOST + FOUND</small></span>
          </Link>
          <nav className={`site-nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            <NavLink to="/home" className={navClass} onClick={closeMenu}>Browse items</NavLink>
            <NavLink to="/report" className={navClass} onClick={closeMenu}>Report item</NavLink>
            <NavLink to="/inbox" className={navClass} onClick={closeMenu}>Inbox</NavLink>
            <NavLink to="/welcome" className={navClass} onClick={closeMenu}>Welcome</NavLink>
            <NavLink to="/profile" className={({ isActive }) => `mobile-profile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>My profile</NavLink>
          </nav>
          <div className="site-header-actions">
            <span className="campus-live"><i /> Campus board</span>
            <Link to="/report" className="header-report"><Plus size={15} /> Report item</Link>
            <Link to="/profile" className="header-profile" aria-label="My profile"><UserRound size={16} /></Link>
            <button type="button" className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
      </header>

      <main className="site-main"><Outlet /></main>

      {!hideMobileNav && <nav className="mobile-tabbar" aria-label="Mobile navigation">
        <NavLink to="/home" className={({ isActive }) => `mobile-tab${isActive ? ' active' : ''}`}><Home size={18} /><span>Home</span></NavLink>
        <NavLink to="/report" className={({ isActive }) => `mobile-tab mobile-post-tab${isActive ? ' active' : ''}`}><span className="mobile-plus"><Plus size={18} /></span><span>Post</span></NavLink>
        <NavLink to="/inbox" className={({ isActive }) => `mobile-tab${isActive ? ' active' : ''}`}><Inbox size={18} /><span>Inbox</span></NavLink>
        <NavLink to="/profile" className={({ isActive }) => `mobile-tab${isActive ? ' active' : ''}`}><UserRound size={17} /><span>Profile</span></NavLink>
      </nav>}

      <footer className="site-footer">
        <div className="footer-brand"><span className="site-brand-mark"><Compass size={16} /></span><strong>FOUND</strong><span>Small acts. Missing things found.</span></div>
        <span className="footer-safety">Meet somewhere public on campus · Keep personal details private</span>
      </footer>
    </div>
  );
}
