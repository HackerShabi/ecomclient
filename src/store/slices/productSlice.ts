import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
}

interface ProductState {
  items: Product[];
  featured: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: ProductState = {
  items: [],
  featured: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.featured = action.payload.filter(product => product.featured);
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (action.payload.featured) {
          state.featured = [...state.featured, action.payload];
        } else {
          state.featured = state.featured.filter(p => p.id !== action.payload.id);
        }
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.featured = state.featured.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setLoading,
  setError,
  updateProduct,
  removeProduct,
} = productSlice.actions;

export default productSlice.reducer; 