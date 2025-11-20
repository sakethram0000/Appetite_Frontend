import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { userService } from '../services/userService';
import UserDetailsModal from './UserDetailsModal';

const UserList = ({ onCreateUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await userService.getUsers();
      setUsers(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditData({ ...user });
  };

  const handleSave = async () => {
    try {
      await userService.updateUser(editingUser, editData);
      setEditingUser(null);
      setEditData({});
      loadUsers();
      alert('User updated successfully!');
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      loadUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserUpdate = () => {
    loadUsers();
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <User className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Users ({users.length})</h2>
        </div>
        <button
          onClick={onCreateUser}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            {editingUser === user.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editData.role || ''}
                      onChange={(e) => handleEditChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="carrier">Carrier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={editData.organizationName || ''}
                      onChange={(e) => handleEditChange('organizationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Header with Avatar and Basic Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{user.name || 'Unknown User'}</h3>
                      <p className="text-gray-600">{user.email || 'No email'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.roles?.[0] === 'admin' ? 'bg-red-100 text-red-800' :
                          user.roles?.[0] === 'carrier' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.roles?.[0] || 'No Role'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.isLocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUserClick(user)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      Manage Account
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                

              </div>
            )}
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
      
      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserUpdate={handleUserUpdate}
      />
    </motion.div>
  );
};

export default UserList;