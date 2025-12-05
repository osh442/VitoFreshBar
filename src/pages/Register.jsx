import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PHONE_PREFIX = '+359';
const sanitizePhoneDigits = (value) => {
  const remainder = value.startsWith(PHONE_PREFIX)
    ? value.slice(PHONE_PREFIX.length)
    : value;
  return remainder.replace(/\D/g, '').slice(0, 9);
};

const validatePhoneDigits = (digits) => {
  if (!digits) {
    return 'Моля въведете телефон!';
  }
  if (digits.length !== 9) {
    return 'Недостатъчна сължина на телефонния номер!';
  }
  return '';
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      setFormState((prev) => ({ ...prev, phone: sanitizePhoneDigits(value) }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setError('Паролите не съвпадат!');
      return;
    }

    const phoneError = validatePhoneDigits(formState.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    try {
      setError('');
      await register(
        formState.name.trim(),
        formState.email.trim(),
        formState.password,
        `${PHONE_PREFIX}${formState.phone}`,
      );
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Възникна проблем при регистрацията. Опитайте отново!');
    }
  };

  return (
    <section className="section">
      <div className="container form-card auth-card">
        <h2>Регистрация</h2>
        {error && <p className="form-error">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="full-width">
            Име
            <input name="name" value={formState.name} onChange={handleChange} required />
          </label>
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
            Телефон
            <div className="phone-field">
              <span className="phone-prefix">{PHONE_PREFIX}</span>
              <input
                name="phone"
                inputMode="numeric"
                value={formState.phone}
                onChange={handleChange}
                maxLength={9}
                required
              />
            </div>
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
          <label className="full-width">
            Повтори паролата
            <input
              name="confirmPassword"
              type="password"
              value={formState.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary full-width">
            Създай профил
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
