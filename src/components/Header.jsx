import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import { menuCategories } from '../constants/categories';
import logoImage from '../assets/images/VitoFreshBar.png';

const navLinks = [
  { to: '/', label: 'Начало' },
  { to: '/menu', label: 'Меню' },
  { to: '/promotion', label: 'Промоции' },
  { to: '/about', label: 'За нас' },
  { to: '/contact', label: 'Контакти' },
];

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuHoverTimeout = useRef(null);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const location = useLocation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(
    () => () => {
      if (menuHoverTimeout.current) {
        clearTimeout(menuHoverTimeout.current);
      }
    },
    [],
  );

  const shouldHideOnTop = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (!shouldHideOnTop) {
        setIsHeaderVisible(true);
        return;
      }
      setIsHeaderVisible(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHideOnTop]);

  useEffect(() => {
    if (isHeaderVisible) {
      document.body.setAttribute('data-header-visible', 'true');
    } else {
      document.body.removeAttribute('data-header-visible');
    }

    return () => {
      document.body.removeAttribute('data-header-visible');
    };
  }, [isHeaderVisible]);

  const isMenuPage = location.pathname.startsWith('/menu');

  const openMenuDropdown = () => {
    if (isMenuPage) {
      return;
    }
    if (menuHoverTimeout.current) {
      clearTimeout(menuHoverTimeout.current);
    }
    setMenuDropdownOpen(true);
  };

  const closeMenuDropdown = () => {
    if (menuHoverTimeout.current) {
      clearTimeout(menuHoverTimeout.current);
    }
    menuHoverTimeout.current = setTimeout(() => {
      setMenuDropdownOpen(false);
    }, 120);
  };

  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={`site-header${isHeaderVisible ? ' site-header--visible' : ''}`}>
      <div className="container header-inner">
        <NavLink to="/" className="logo" aria-label="VitoFreshBar начало">
          <img src={logoImage} alt="VitoFreshBar logo" className="logo-image" />
        </NavLink>

        <nav className="nav">
          {navLinks.map((item) => {
            if (item.to === '/menu') {
              return (
                <div
                  key={item.to}
                  className={`nav-item nav-item-dropdown${
                    menuDropdownOpen && !isMenuPage ? ' open' : ''
                  }`}
                  onMouseEnter={openMenuDropdown}
                  onMouseLeave={closeMenuDropdown}
                  onFocusCapture={openMenuDropdown}
                  onBlurCapture={closeMenuDropdown}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' nav-link-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                  <div className="nav-dropdown" role="menu" aria-hidden={isMenuPage}>
                    <div className="nav-dropdown-column">
                      {menuCategories.slice(0, Math.ceil(menuCategories.length / 2)).map(
                        (category) => (
                          <Link
                            key={category.id}
                            to={category.href}
                            className="nav-dropdown-link"
                            role="menuitem"
                          >
                            {category.title}
                          </Link>
                        ),
                      )}
                    </div>
                    <div className="nav-dropdown-column">
                      {menuCategories.slice(Math.ceil(menuCategories.length / 2)).map(
                        (category) => (
                          <Link
                            key={category.id}
                            to={category.href}
                            className="nav-dropdown-link"
                            role="menuitem"
                          >
                            {category.title}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="header-cta">
          <NavLink to="/order" className="cart-link" aria-label="Поръчки">
            🛒
            {count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>

          {user ? (
            <div className="profile-menu" ref={dropdownRef}>
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              >
                {initials || 'П'}
              </button>
              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <p className="name">{user.name}</p>
                    <p className="email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-link">
                    Профил
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-link">
                      Контролен панел
                    </Link>
                  )}
                  <button type="button" className="dropdown-link" onClick={logout}>
                    <NavLink to="/login" className="btn btn-text">
                      Изход
                    </NavLink>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-text">
              Вход
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


