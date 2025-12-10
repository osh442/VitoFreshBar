import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'contactSubmissions';

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

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState(getStoredSubmissions);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleUpdate = () => setSubmissions(getStoredSubmissions());
    window.addEventListener('contactSubmissionsUpdated', handleUpdate);
    handleUpdate();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        handleUpdate();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('contactSubmissionsUpdated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return submissions.filter((item) =>
      [item.firstName, item.lastName, item.email, item.message].some((field) =>
        (field || '').toLowerCase().includes(term),
      ),
    );
  }, [submissions, search]);

  const clearSubmissions = () => {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Сигурни ли сте, че искате да изчистите всички записи?')) return;
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('contactSubmissionsUpdated'));
    setSubmissions([]);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <p className="eyebrow">Контактна форма</p>
          <h2>Всички запитвания</h2>
          <p className="admin-subtitle">
            Запазени са локално в sessionStorage за демонстрационни цели.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="search"
            className="admin-search"
            placeholder="Филтър по име, имейл или съобщение..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" className="btn btn-outline" onClick={clearSubmissions}>
            Изчисти
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>Няма изпратени форми или търсенето не върна резултати.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table submissions-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Имейл</th>
                <th>Телефон</th>
                <th>Маркетинг</th>
                <th>Съобщение</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.submittedAt).toLocaleString('bg-BG')}</td>
                  <td>
                    {entry.firstName} {entry.lastName}
                  </td>
                  <td>{entry.email}</td>
                  <td>{entry.phone || '—'}</td>
                  <td>{entry.marketingOptIn ? 'Да' : 'Не'}</td>
                  <td>{entry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
