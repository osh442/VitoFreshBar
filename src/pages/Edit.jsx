import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as productsApi from '../api/products';
import useAuth from '../hooks/useAuth';

const Edit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formState, setFormState] = useState(null);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setError('');
    productsApi.getOne(id).then((data) => {
      if (!mounted) {
        return;
      }

      if (!data) {
        setError('Ястието не можа да бъде открито.');
        return;
      }

      if (!user || data.authorId !== user.id) {
        setError('Само авторът може да редактира това ястие.');
        return;
      }

      setFormState({
        ...data,
        calories: data.calories ?? '',
      });
    });

    return () => {
      mounted = false;
    };
  }, [id, user]);

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p>{error}</p>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Назад
          </button>
        </div>
      </section>
    );
  }

  if (!formState) {
    return (
      <section className="section">
        <div className="container">
          <p>Зареждаме...</p>
        </div>
      </section>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await productsApi.update(id, {
        ...formState,
        price: Number(formState.price),
        calories: formState.calories ? Number(formState.calories) : undefined,
      });
      navigate(`/details/${id}`);
    } catch {
      setSubmitError('Редакцията се провали. Опитай отново.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container form-card">
        <h2>Редакция на {formState.title}</h2>
        {submitError && <p className="form-error">{submitError}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Име
            <input name="title" value={formState.title} onChange={handleChange} required />
          </label>
          <label>
            Кратко описание
            <input name="shortText" value={formState.shortText} onChange={handleChange} required />
          </label>
          <label className="full-width">
            Детайли
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>
          <label>
            Цена
            <input
              name="price"
              type="number"
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
              name="calories"
              type="number"
              min="0"
              value={formState.calories}
              onChange={handleChange}
            />
          </label>
          <label>
            Грамаж
            <input name="weight" value={formState.weight} onChange={handleChange} />
          </label>
          <label className="full-width">
            Изображение (URL)
            <input name="image" value={formState.image} onChange={handleChange} required />
          </label>

          <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Запазваме...' : 'Запази промените'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Edit;
