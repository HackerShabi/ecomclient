import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { setProducts, setLoading, setError } from '../store/slices/productSlice';
import { productsAPI } from '../services/api';

const Products = () => {
  const dispatch = useDispatch();
  const { items: products = [], loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));
        const response = await productsAPI.getAll();
        dispatch(setProducts(response.data));
      } catch (err) {
        dispatch(setError('Error fetching products'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();
  }, [dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesSearch =
      !filters.search ||
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [...new Set(products.map((product) => product.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">All Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search products..."
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredProducts.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group"
          >
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-center object-cover group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              ${product.price}
            </p>
            {product.stock === 0 && (
              <p className="mt-1 text-sm text-red-600">Out of stock</p>
            )}
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products; 