import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard-grid">
      <div className="admin-card">
        <p className="eyebrow">Добре дошъл отново</p>
        <h2>{user?.name || 'Admin'}</h2>
        <p>Използвай менюто, за да управляваш продуктите и входящите заявки.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Последни запитвания</p>
            <h3>Контактна форма</h3>
          </div>
          <span className="admin-badge">0</span>
        </div>
        <p className="admin-subtitle">
          Онлайн контактната форма е изключена и не изпраща данни към админ панела. Проверявайте
          служебните канали, за да отговаряте на клиентските въпроси.
        </p>
        <ul className="contact-disabled-list">
          <li>
            <strong>Имейл:</strong> <a href="mailto:customer@vitoFreshBar.bg">customer@vitoFreshBar.bg</a>
          </li>
          <li>
            <strong>Телефон:</strong> <a href="tel:+359895525955">+359 895 525 955</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
