import axios from 'axios';

// Function to find the correct backend port
const findBackendPort = async () => {
  const ports = [5001, 5002, 5003, 5004, 5005];
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      if (response.ok) {
        return port;
      }
    } catch (error) {
      continue;
    }
  }
  return 5001; // fallback to default port
};

// Create base axios instance
const createApi = async () => {
  const port = await findBackendPort();
  return axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });
};

// Initialize API instance
let apiInstance: ReturnType<typeof axios.create> | null = null;

// Function to get API instance
export const getApi = async () => {
  if (!apiInstance) {
    apiInstance = await createApi();
    
    // Add request interceptor
    apiInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
};

// Auth API
export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const api = await getApi();
    return api.post('/auth/login', data);
  },
  register: async (data: { name: string; email: string; password: string }) => {
    const api = await getApi();
    return api.post('/auth/register', data);
  },
  getCurrentUser: async () => {
    const api = await getApi();
    return api.get('/auth/me');
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const api = await getApi();
    return api.get('/products');
  },
  getById: async (id: string) => {
    const api = await getApi();
    return api.get(`/products/${id}`);
  },
  create: async (data: any) => {
    const api = await getApi();
    return api.post('/products', data);
  },
  update: async (id: string, data: any) => {
    const api = await getApi();
    return api.put(`/products/${id}`, data);
  },
  delete: async (id: string) => {
    const api = await getApi();
    return api.delete(`/products/${id}`);
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const api = await getApi();
    return api.get('/orders');
  },
  getById: async (id: string) => {
    const api = await getApi();
    return api.get(`/orders/${id}`);
  },
  create: async (data: any) => {
    const api = await getApi();
    return api.post('/orders', data);
  },
  updateStatus: async (id: string, status: string) => {
    const api = await getApi();
    return api.patch(`/orders/${id}/status`, { status });
  },
};

// Cart API
export const cartAPI = {
  addItem: async (data: any) => {
    const api = await getApi();
    return api.post('/cart', data);
  },
  removeItem: async (id: string) => {
    const api = await getApi();
    return api.delete(`/cart/${id}`);
  },
  updateQuantity: async (id: string, quantity: number) => {
    const api = await getApi();
    return api.patch(`/cart/${id}`, { quantity });
  },
  getCart: async () => {
    const api = await getApi();
    return api.get('/cart');
  },
};

export default getApi; 