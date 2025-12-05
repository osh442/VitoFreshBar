import useAuth from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-card">
      <p className="eyebrow">Welcome back</p>
      <h2>{user?.name || 'Admin'}</h2>
      <p>Use the navigation to manage products and upcoming admin features.</p>
    </div>
  );
};

export default AdminDashboard;
