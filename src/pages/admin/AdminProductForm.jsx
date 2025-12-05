import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as productsApi from '../../api/products';
import { menuCategories } from '../../constants/categories';
import useAuth from '../../hooks/useAuth';

const baseForm = {
  title: '',
  shortText: '',
  description: '',
  price: '',
  calories: '',
  weight: '',
  image: '',
  category: 'salads',
  isActive: true,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formState, setFormState] = useState(baseForm);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    let active = true;
    setLoading(true);
    productsApi
      .getOne(id)
      .then((data) => {
        if (!active) {
          return;
        }

        if (!data) {
          setError('Продуктът не беше намерен.');
          return;
        }

        setFormState({
          ...baseForm,
          ...data,
          price: data.price ?? '',
          calories: data.calories ?? '',
          isActive: data.isActive !== false,
        });
      })
      .catch(() => {
        if (active) {
          setError('Проблем при зареждането на продукта.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormState((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formState,
      price: Number(formState.price),
      calories: formState.calories ? Number(formState.calories) : undefined,
      authorId: formState.authorId || user?.id || 'admin',
      isActive: formState.isActive !== false,
    };

    try {
      if (isEdit) {
        await productsApi.update(id, payload);
      } else {
        await productsApi.create(payload);
      }
      navigate('/admin/products');
    } catch {
      setError('Възникна грешка при записа. Опитайте отново.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Зареждане...</p>;
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <p className="eyebrow">{isEdit ? 'Edit product' : 'Create product'}</p>
          <h2>{isEdit ? formState.title : 'New menu item'}</h2>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="full-width">
          Заглавие
          <input name="title" value={formState.title} onChange={handleChange} required />
        </label>
        <label className="full-width">
          Кратко описание
          <input name="shortText" value={formState.shortText} onChange={handleChange} required />
        </label>
        <label className="full-width">
          Описание
          <textarea
            name="description"
            rows={4}
            value={formState.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Цена (BGN)
          <input
            type="number"
            name="price"
            min="0"
            step="0.1"
            value={formState.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Калории
          <input
            type="number"
            name="calories"
            min="0"
            value={formState.calories}
            onChange={handleChange}
          />
        </label>
        <label>
          Тегло
          <input name="weight" value={formState.weight} onChange={handleChange} />
        </label>
        <label>
          Категория
          <select name="category" value={formState.category} onChange={handleChange}>
            {menuCategories
              .filter((category) => category.id !== 'all')
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
          </select>
        </label>
        <label className="full-width">
          Изображение (URL)
          <input name="image" 
          value={formState.image} 
          onChange={handleChange} />
        </label>
        <label className="full-width checkbox-field">
          <input
            type="checkbox"
            name="isActive"
            checked={formState.isActive !== false}
            onChange={handleChange}
          />
          <span>Показвай в менюто</span>
        </label>
        <button type="submit" className="btn btn-primary full-width" disabled={submitting}>
          {submitting ? 'Запис...' : 'Запази'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
