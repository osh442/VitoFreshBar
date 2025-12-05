import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await login(formState.email, formState.password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Невалиден имейл или парола.');
    }
  };

  return (
    <section className="section">
      <div className="container form-card auth-card">
        <h2>Вход</h2>
        {error && <p className="form-error">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="full-width">
            Имейл
            <input
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full-width">
            Парола
            <input
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary full-width">
            Влез
          </button>
        </form>
        <p className="auth-alt">
          Нямаш акаунт?{' '}
          <Link to="/register">
            Регистрация
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
