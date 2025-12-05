import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as productsApi from '../../api/products';
import { formatPricePair } from '../../utils/currency';
import { menuCategories } from '../../constants/categories';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceOrder, setPriceOrder] = useState('none');

  const loadProducts = () => {
    setLoading(true);
    setError('');
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Неуспешно зареждане на продуктите.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter !== 'all') {
      list = list.filter((product) => product.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      list = list.filter((product) =>
        statusFilter === 'active' ? product.isActive !== false : product.isActive === false,
      );
    }

    if (priceOrder !== 'none') {
      list = list.sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        return priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return list;
  }, [products, categoryFilter, statusFilter, priceOrder]);

  const selectedProducts = useMemo(
    () => products.filter((product) => selectedIds.includes(product.id)),
    [products, selectedIds],
  );

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredProducts.map((product) => product.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const handleBulkStatus = async (isActive) => {
    if (!selectedIds.length) {
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((product) =>
          productsApi.update(product.id, { isActive }),
        ),
      );
      clearSelection();
      loadProducts();
    } catch {
      setError('Неуспешна промяна на статуса. Опитайте отново.');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      return;
    }

    const confirmation =
      selectedIds.length === 1
        ? window.confirm('Сигурни ли сте, че искате да изтриете продукта?')
        : window.confirm('Сигурни ли сте, че искате да изтриете избраните продукти?');
    if (!confirmation) {
      return;
    }

    try {
      await Promise.all(selectedIds.map((id) => productsApi.remove(id)));
      clearSelection();
      loadProducts();
    } catch {
      setError('Възникна грешка при изтриване. Опитайте отново.');
    }
  };

  const handleEditSelected = () => {
    if (selectedIds.length === 1) {
      navigate(`/admin/products/${selectedIds[0]}/edit`);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <p className="eyebrow">Products</p>
          <h2>Manage menu items</h2>
        </div>
      </div>
      <div className="admin-toolbar">
        <div className="admin-actions-inline">
          <Link to="/admin/products/new" className="btn btn-primary">
            New product
          </Link>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleEditSelected}
            disabled={selectedIds.length !== 1}
          >
            Edit selected
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => handleBulkStatus(true)}
            disabled={!selectedIds.length}
          >
            Activate
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => handleBulkStatus(false)}
            disabled={!selectedIds.length}
          >
            Deactivate
          </button>
          <button
            type="button"
            className="btn btn-remove-red"
            onClick={handleBulkDelete}
            disabled={!selectedIds.length}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="admin-filter-panel">
        <label>
          Category
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All</option>
            {menuCategories
              .filter((category) => category.id !== 'all')
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="active">Active only</option>
            <option value="hidden">Hidden only</option>
          </select>
        </label>
        <label>
          Price order
          <select value={priceOrder} onChange={(event) => setPriceOrder(event.target.value)}>
            <option value="none">Default</option>
            <option value="asc">Lowest first</option>
            <option value="desc">Highest first</option>
          </select>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Зареждане...</p>
      ) : (
        <div className="admin-table-wrapper" style={{ marginTop: '1.5rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-select-all">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      filteredProducts.every((product) => selectedIds.includes(product.id))
                    }
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                  <span>Select all</span>
                </th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Price</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const prices = formatPricePair(product.price);
                return (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelection(product.id)}
                        aria-label={`Select ${product.title}`}
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>{product.isActive === false ? 'Hidden' : 'Active'}</td>
                    <td>
                      <span className="price-bgn">{prices.bgn}</span>
                      <br />
                      <span className="price-eur">{prices.eur}</span>
                    </td>
                    <td>{product.likes?.length || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
