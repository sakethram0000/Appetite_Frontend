const API_CONFIG = {
  // For local development
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5131/api',
  // For deployment - uncomment and update URLs below:
  // BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://your-backend-url.com/api',
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