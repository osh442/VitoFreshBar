import { useEffect, useMemo, useState } from 'react';
import useAuth from '../../hooks/useAuth';

const STORAGE_KEY = 'contactSubmissions';
const MAX_VISIBLE = 6;

const getStoredSubmissions = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Unable to parse contact submissions', error);
    return [];
  }
};

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString('bg-BG', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState(getStoredSubmissions);

  useEffect(() => {
    const handleUpdate = () => setSubmissions(getStoredSubmissions());
    window.addEventListener('contactSubmissionsUpdated', handleUpdate);
    handleUpdate();
    return () => window.removeEventListener('contactSubmissionsUpdated', handleUpdate);
  }, []);

  const recentSubmissions = useMemo(() => submissions.slice(0, MAX_VISIBLE), [submissions]);

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
          <span className="admin-badge">{submissions.length}</span>
        </div>
        {recentSubmissions.length === 0 ? (
          <p>Все още няма нови запитвания.</p>
        ) : (
          <ul className="contact-submissions">
            {recentSubmissions.map((item) => (
              <li key={item.id} className="contact-submission-row">
                <div>
                  <strong>
                    {item.firstName} {item.lastName}
                  </strong>{' '}
                  <span className="contact-submission-meta">({item.email})</span>
                </div>
                <p className="contact-submission-message">{item.message}</p>
                <div className="contact-submission-footer">
                  <span>{formatDate(item.submittedAt)}</span>
                  <span>
                    Маркетинг: <strong>{item.marketingOptIn ? 'Да' : 'Не'}</strong>
                  </span>
                  {item.phone && <span>Телефон: {item.phone}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
