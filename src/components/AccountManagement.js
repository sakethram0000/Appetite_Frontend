import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Unlock, 
  UserCheck, 
  UserX, 
  Key, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('password-management');
  const [lockedAccounts, setLockedAccounts] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [reason, setReason] = useState('');

  // API URL configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com' 
      : 'http://localhost:5131');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

      if (activeTab === 'account-status') {
        // Load locked accounts
        const lockedResponse = await fetch(`${API_BASE_URL}/api/usermanagement/locked-accounts`, { 
          headers,
          signal: controller.signal
        });
        if (lockedResponse.ok) {
          const lockedData = await lockedResponse.json();
          setLockedAccounts(lockedData.lockedUsers || []);
        }

        // Load inactive users
        const inactiveResponse = await fetch(`${API_BASE_URL}/api/usermanagement/inactive-users`, { 
          headers,
          signal: controller.signal
        });
        if (inactiveResponse.ok) {
          const inactiveData = await inactiveResponse.json();
          setInactiveUsers(inactiveData.inactiveUsers || []);
        }
      }
      
      clearTimeout(timeoutId);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out after 60 seconds');
      } else {
        console.error('Error loading data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

      let endpoint = '';
      let body = { userId, reason };

      switch (action) {
        case 'unlock':
          endpoint = '/api/usermanagement/unlock-account';
          break;
        case 'activate':
          endpoint = '/api/usermanagement/activate-user';
          break;
        case 'deactivate':
          endpoint = '/api/usermanagement/deactivate-user';
          break;
        case 'force-reset':
          endpoint = '/api/usermanagement/force-reset-password';
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Action completed successfully');
        setShowModal(false);
        setReason('');
        loadData();
      } else {
        const error = await response.json();
        alert(error.message || 'Action failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out after 60 seconds');
        alert('Request timed out. Please try again.');
      } else {
        console.error('Error performing action:', error);
        alert('An error occurred while performing the action');
      }
    }
  };

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
    setReason('');
  };

  const tabs = [
    { id: 'password-management', label: 'Password Management', icon: Key },
    { id: 'account-status', label: 'Account Status', icon: Shield },
    { id: 'activity-log', label: 'Activity Log', icon: Clock }
  ];

  const renderPasswordManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-blue-600" />
          Force Password Reset
        </h3>
        <p className="text-gray-600 mb-4">
          Send password reset emails to users who need to update their passwords.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-blue-800">How it works:</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Select a user from the User Management section</li>
                <li>• Click "Force Reset Password" action</li>
                <li>• User receives an email with reset link</li>
                <li>• Reset link expires in 15 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountStatus = () => (
    <div className="space-y-6">
      {/* Locked Accounts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Unlock className="w-5 h-5 mr-2 text-red-600" />
            Locked Accounts ({lockedAccounts.length})
          </h3>
          <button
            onClick={loadData}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading locked accounts...</p>
          </div>
        ) : lockedAccounts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No locked accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Failed Attempts</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Locked Until</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lockedAccounts.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {user.failedLoginAttempts} attempts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {user.lockoutEnd ? new Date(user.lockoutEnd).toLocaleString() : 'Indefinite'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openModal('unlock', user)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Unlock className="w-4 h-4 mr-1" />
                        Unlock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inactive Users */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserX className="w-5 h-5 mr-2 text-orange-600" />
          Inactive Users ({inactiveUsers.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading inactive users...</p>
          </div>
        ) : inactiveUsers.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No inactive users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Deactivated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {user.deactivatedAt ? new Date(user.deactivatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {user.deactivationReason || 'No reason provided'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openModal('activate', user)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Activate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderActivityLog = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-purple-600" />
        Recent Activity
      </h3>
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Activity log will be displayed here</p>
        <p className="text-sm text-gray-500 mt-2">Select a user from User Management to view their activity</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage user passwords, account status, and security settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'password-management' && renderPasswordManagement()}
          {activeTab === 'account-status' && renderAccountStatus()}
          {activeTab === 'activity-log' && renderActivityLog()}
        </motion.div>

        {/* Action Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {modalType === 'unlock' && 'Unlock Account'}
                {modalType === 'activate' && 'Activate User'}
                {modalType === 'deactivate' && 'Deactivate User'}
                {modalType === 'force-reset' && 'Force Password Reset'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {modalType === 'unlock' && `Unlock account for ${selectedUser?.name}?`}
                {modalType === 'activate' && `Activate user ${selectedUser?.name}?`}
                {modalType === 'deactivate' && `Deactivate user ${selectedUser?.name}?`}
                {modalType === 'force-reset' && `Send password reset email to ${selectedUser?.name}?`}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason {modalType === 'deactivate' && '(Required)'} {modalType === 'force-reset' && '(Optional)'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter reason for this action..."
                  required={modalType === 'deactivate'}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(modalType, selectedUser?.id)}
                  disabled={modalType === 'deactivate' && !reason.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AccountManagement;