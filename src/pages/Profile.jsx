import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <p>
            Нямаш активен профил. <Link to="/login">Влез</Link> или{' '}
            <Link to="/register">създай акаунт</Link>, за да следиш поръчките си.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container profile-card">
        <div>
          <p className="eyebrow">Профил</p>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-actions">
          <Link to="/order" className="btn btn-primary">
            Нова поръчка
          </Link>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Изход
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
