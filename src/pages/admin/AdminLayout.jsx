import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import useAuth from '../../hooks/useAuth';

const adminLinks = [
  {
    to: '/admin',
    label: 'Табло',
    description: 'Общ преглед и метрики за последните активности.',
    end: true,
  },
  {
    to: '/admin/products',
    label: 'Продукти',
    description: 'Управлявай наличните предложения и промоции.',
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const activeSection = useMemo(
    () =>
      adminLinks.find((link) =>
        link.end ? location.pathname === link.to : location.pathname.startsWith(link.to),
      )?.label || 'Табло',
    [location.pathname],
  );

  const formattedDate = new Intl.DateTimeFormat('bg-BG', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return (
    <section className="section admin-panel">
      <div className="container admin-layout">
        <header className="admin-header">
          <div className="admin-header-info">
            <p className="admin-eyebrow">Admin Console</p>
            <h1>Здравей{user?.name ? `, ${user.name}` : ''}</h1>
            <p className="admin-subtitle">
              {`Работиш в секция "${activeSection}". Бързите действия са вдясно.`}
            </p>
          </div>
          <div className="admin-quick-actions">
            <NavLink to="/admin/products/new" className="btn btn-primary">
              Нов продукт
            </NavLink>
            <Link to="/menu" className="btn btn-outline">
              Виж сайта
            </Link>
          </div>
        </header>

        <div className={`admin-shell${navOpen ? ' admin-shell--nav-open' : ''}`}>
          <aside className="admin-sidebar">
            <button
              type="button"
              className="admin-nav-toggle"
              onClick={() => setNavOpen((prev) => !prev)}
              aria-expanded={navOpen}
            >
              Админ меню
              <span className="admin-nav-toggle-icon" aria-hidden="true">
                ▼
              </span>
            </button>
            <nav className="admin-nav">
              {adminLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-link-card${isActive ? ' admin-link-card-active' : ''}`
                  }
                >
                  <span className="admin-link-title">{item.label}</span>
                  <p>{item.description}</p>
                </NavLink>
              ))}
            </nav>

            <div className="admin-status-card">
              <p className="status-label">Активна секция</p>
              <p className="status-value">{activeSection}</p>
              <p className="status-note">Последна актуализация · {formattedDate}</p>
            </div>
          </aside>

          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLayout;
