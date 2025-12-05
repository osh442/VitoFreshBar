import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { formatPricePair } from '../utils/currency';

const NEW_PRODUCT_WINDOW_MS = 72 * 60 * 60 * 1000;

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id, title, shortText, price, image, createdAt } = product;
  const prices = formatPricePair(price);
  const hasImage = Boolean(image);
  const isNew = createdAt ? Date.now() - createdAt <= NEW_PRODUCT_WINDOW_MS : false;

  const handleOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product);
  };

  return (
    <article className="product-card">
      <Link to={`/details/${id}`} className="product-link">
        <div className={`product-media${hasImage ? '' : ' no-image'}`}>
          {hasImage ? (
            <img src={image} alt={title} />
          ) : (
            <div className="product-placeholder">��� ������</div>
          )}
          {isNew && <span className="product-badge">{'\u041d\u043e\u0432\u043e'}</span>}
        </div>
        <div className="product-body">
          <h3>{title}</h3>
          <p>{shortText}</p>
        </div>
      </Link>
      <div className="product-footer">
        <div className="price-pair">
          <span className="price price-bgn">{prices.bgn}</span>
          <span className="price price-eur">{prices.eur}</span>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleOrder}>
         Купи
        </button>
      </div>
    </article>
  );
};

export default ProductCard;


