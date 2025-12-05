import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import * as productsApi from '../api/products';
import { menuCategories } from '../constants/categories';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { categoryId } = useParams();
  const activeCategory = categoryId || 'all';

  useEffect(() => {
    let mounted = true;
    productsApi
      .getAll()
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Възникна грешка при зареждане на менюто. Опитайте отново.');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.isActive !== false),
    [products],
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return visibleProducts;
    }
    return visibleProducts.filter((product) => product.category === activeCategory);
  }, [visibleProducts, activeCategory]);

  return (
    <section className="section">
      <div className="container">
        <div className="menu-layout">
          <aside className="category-sidebar">
            <h3>Категории</h3>
            <ul>
              {menuCategories.map((category) => {
                const target = category.id === 'all' ? '/menu' : `/menu/${category.id}`;
                return (
                  <li key={category.id}>
                    <Link to={target} className={`category-link${activeCategory === category.id ? ' active' : ''}`}>
                      {category.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="menu-grid-wrapper">
            {error && <p className="form-error">{error}</p>}

            {loading ? (
              <p>Зареждаме свежите предложения...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="menu-empty">
                <p className="eyebrow">Меню</p>
                <h2>Все още няма продукти в тази категория</h2>
                <p>Щом добавим нови предложения, те автоматично ще се появят тук.</p>
              </div>
            ) : (
              <div className="menu-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
