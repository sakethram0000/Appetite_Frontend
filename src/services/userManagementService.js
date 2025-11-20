// For local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131';
// For deployment - uncomment and update URLs below:
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com';

class UserManagementService {
  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return await response.json();
  }

  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return await response.json();
  }

  async forceResetPassword(userId, reason) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/force-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to force reset password');
    }

    return await response.json();
  }

  async unlockAccount(userId, reason) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/unlock-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unlock account');
    }

    return await response.json();
  }

  async activateUser(userId, reason) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/activate-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to activate user');
    }

    return await response.json();
  }

  async deactivateUser(userId, reason) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/deactivate-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to deactivate user');
    }

    return await response.json();
  }

  async getLockedAccounts(page = 1, pageSize = 25) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/locked-accounts?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get locked accounts');
    }

    return await response.json();
  }

  async getInactiveUsers(page = 1, pageSize = 25) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/inactive-users?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get inactive users');
    }

    return await response.json();
  }

  async getActivityLog(userId, page = 1, pageSize = 25) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/activity-log/${userId}?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get activity log');
    }

    return await response.json();
  }

  async verifyResetToken(token) {
    const response = await fetch(`${API_BASE_URL}/api/usermanagement/verify-reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify token');
    }

    return await response.json();
  }
}

export const userManagementService = new UserManagementService();