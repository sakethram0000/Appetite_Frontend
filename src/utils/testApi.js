// Get API base URL
const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com' 
      : 'http://localhost:5131');
};

// Test API connectivity
export const testApiConnection = async () => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/swagger/index.html`);
    console.log('Backend reachable:', response.ok);
    return response.ok;
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};

// Test login API
export const testLogin = async (username = 'admin@appetitechecker.com', password = 'Admin123!') => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/canvas/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password })
    });
    
    console.log('Login API response:', response.status);
    const data = await response.json();
    console.log('Login API data:', data);
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};