import { useEffect, useState } from 'react';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';

const PHONE_PREFIX = '+359';

const MAX_QUANTITY = 75;

const sanitizeDigits = (value = '') => {
  const remainder = value.startsWith(PHONE_PREFIX)
    ? value.slice(PHONE_PREFIX.length)
    : value;
  return remainder.replace(/\D/g, '').slice(0, 9);
};

const validateDigits = (digits) => {
  if (!digits) {
    return 'Моля въведете телефон.';
  }
  if (digits.length !== 9) {
    return 'Телефонът трябва да съдържа точно 9 цифри след +359.';
  }
  if (!/^\d+$/.test(digits)) {
    return 'Телефонът може да съдържа само цифри.';
  }
  return '';
};

const baseForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  payment: 'cash',
};

const withUserDefaults = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: sanitizeDigits(user?.phone || ''),
});

const Order = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const [formState, setFormState] = useState(() => ({
    ...baseForm,
    ...withUserDefaults(user),
  }));
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      ...withUserDefaults(user),
    }));
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      setFormState((prev) => ({ ...prev, phone: sanitizeDigits(value) }));
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Number(value);
    if (Number.isNaN(quantity)) {
      return;
    }
    const clamped = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    updateQuantity(id, clamped);
  };

  const handleQuantityStep = (id, step) => {
    const target = items.find((item) => item.id === id);
    if (!target) {
      return;
    }
    const next = Math.max(1, Math.min(MAX_QUANTITY, target.quantity + step));
    updateQuantity(id, next);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!items.length) {
      setError('Количката е празна. Добавете продукт от менюто.');
      return;
    }

    if (!formState.name || !formState.email || !formState.phone || !formState.address) {
      setError('Попълнете име, имейл, телефон и адрес, за да завършим поръчката.');
      return;
    }

    const phoneError = validateDigits(formState.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setSuccess('Благодарим! Потвърждаваме поръчката и ще се свържем с вас.');
    setError('');
    setFormState({
      ...baseForm,
      ...withUserDefaults(user),
    });
    clearCart();
  };

  if (!items.length) {
    return (
      <section className="section">
        <div className="container form-card">
          <h2>Няма добавени продъкти от нашето свежо меню</h2>
          {success && <p className="form-success">{success}</p>}
          <p>Количката е празна. Изберете продукт от менюто.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container form-card">
        <h2>Добавени продъкти от нашето свежо меню</h2>

        <div className="cart-list">
          {items.map((item) => {
            const productTotal = (item.quantity * item.price).toFixed(2);
            return (
              <article key={item.id} className="cart-item">
                <div className="cart-item-info">
                  {item.image && <img src={item.image} alt={item.title} />}
                  <div className="cart-item-body">
                    <div className="cart-item-details">
                      <h3>{item.title}</h3>
                      <div className="cart-item-meta">
                        <span className="price-chip">{productTotal} лв.</span>
                        <div className="quantity-control" aria-label="Количество">
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => handleQuantityStep(item.id, -1)}
                            aria-label="Намали количество"
                          >
                            &minus;
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={MAX_QUANTITY}
                            value={item.quantity}
                            onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                          />
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => handleQuantityStep(item.id, 1)}
                            aria-label="Увеличи количество"
                          >
                            +
                          </button>
                        </div>
                        <span className="quantity-unit"></span>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        Премахни
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="cart-summary">
            <p>
              Общо: <strong>{total.toFixed(2)} лв.</strong>
            </p>
            <button type="button" className="remove-btn" onClick={clearCart}>
              Изчисти количката
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Име
            <input name="name" value={formState.name} onChange={handleChange} required />
          </label>
          <label>
            Телефон
            <div className="phone-field">
              <span className="phone-prefix">{PHONE_PREFIX}</span>
              <input
                name="phone"
                inputMode="numeric"
                maxLength={9}
                value={formState.phone}
                onChange={handleChange}
                required
              />
            </div>
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
            Адрес
            <input name="address" value={formState.address} onChange={handleChange} required />
          </label>
          <label className="full-width">
            Допълнителни бележки
            <textarea name="notes" rows={4} value={formState.notes} onChange={handleChange} />
          </label>

          <fieldset className="payment-options full-width">
            <legend>Метод на плащане</legend>
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={formState.payment === 'cash'}
                onChange={handleChange}
              />
              <span className="payment-icon cash-icon">💵</span>
              Наложен платеж
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={formState.payment === 'card'}
                onChange={handleChange}
              />
              <span className="payment-icon card-icon">💳</span>
              Плащане с карта
            </label>
          </fieldset>

          {formState.payment === 'card' && (
            <div className="card-form">
              <div className="card-form-row">
                <label>
                  Номер на карта
                  <input
                    name="cardNumber"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </label>
              </div>
              <div className="card-form-row">
                <label>
                  Валидна до
                  <input name="cardExpiry" placeholder="MM/YY" required />
                </label>
                <label>
                  CVV
                  <input name="cardCvv" inputMode="numeric" placeholder="123" required />
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary full-width">
            Изпрати поръчка
          </button>
        </form>
      </div>
    </section>
  );
};

export default Order;
