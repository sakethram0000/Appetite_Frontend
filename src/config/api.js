const API_CONFIG = {
  // API URL configuration
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com/api' 
      : 'http://localhost:5131/api'),
  ENDPOINTS: {
    LOGIN: '/canvas/login',
    REGISTER: '/canvas/register',
    CARRIERS: '/canvas/carriers',
    CARRIER: '/canvas/carrier',
    PRODUCTS: '/canvas/products',
    PRODUCT: '/canvas/product',
    RULES: '/canvas/rules',
    RULE: '/canvas/rule'
  }
};

export default API_CONFIG;