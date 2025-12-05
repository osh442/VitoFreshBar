import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import * as productsApi from '../api/products';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    productsApi
      .getOne(id)
      .then((data) => {
        if (!active) {
          return;
        }

        if (!data || data.isActive === false) {
          setError('Продуктът не е достъпен.');
        }

        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError('Възникна грешка при зареждане на детайлите.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!product) {
      return;
    }

    const confirmation = window.confirm('Наистина ли искаш да изтриеш ястието?');
    if (!confirmation) {
      return;
    }

    setProcessing(true);
    try {
      await productsApi.remove(product.id);
      navigate('/menu');
    } catch {
      setActionError('Изтриването не беше успешно. Опитай отново.');
      setProcessing(false);
    }
  };



  const handleLike = async () => {
    if (!product || !user || user.id === product.authorId) {
      return;
    }

   
  };

  const handleBuy = () => {
    if (!product) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Зареждаме детайлите...</p>
        </div>
      </section>
    );
  }

  if (error || !product || product.isActive === false) {
    return (
      <section className="section">
        <div className="container">
          <p>{error || 'Продуктът не е наличен.'}</p>
          <Link className="btn btn-outline" to="/menu">
            Назад към менюто
          </Link>
        </div>
      </section>
    );
  }

  const isAuthor = user && user.id === product.authorId;
  const likes = product.likes || [];
  const hasLiked = user && likes.includes(user.id);
  const canLike = user && !isAuthor;

  return (
    <section className="section">
      <div className="container details-layout">
        <div className="details-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="details-content">
          <p className="eyebrow">Супер храна</p>
          <h2>{product.title}</h2>
          <p>{product.description}</p>

          <div className="details-meta">
            <span>
              Калории: <strong>{product.calories}</strong>
            </span>
            <span>
              Грамаж: <strong>{product.weight}</strong>
            </span>
            <span className="price-tag">{product.price} лв.</span>
          </div>

          <div className="like-row">
            <span className="likes-count">{likes.length} харесвания</span>
            {canLike && (
              <button
                type="button"
                className={`btn btn-outline ${hasLiked ? 'btn-liked' : ''}`}
                onClick={handleLike}
              >
                {hasLiked ? 'Премахни харесване' : 'Харесай'}
              </button>
            )}
          </div>

          {actionError && <p className="form-error">{actionError}</p>}
                
          <div className="details-actions">
            
            <button type="button" className="btn btn-primary" onClick={handleBuy}>
              Купи
            </button>
            <Link to="/menu" className="btn btn-outline">
              Назад към менюто
            </Link>

            {isAuthor && (
              <>
                <Link to={`/edit/${product.id}`} className="btn btn-primary">
                  Редакция
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={processing}
                  onClick={handleDelete}
                >
                  Изтриване
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;





