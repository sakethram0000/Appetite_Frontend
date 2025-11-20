import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Building, 
  Key, 
  Unlock, 
  UserCheck, 
  UserX,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { userManagementService } from '../services/userManagementService';

const UserDetailsModal = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [reason, setReason] = useState('');

  const handleAction = async (action) => {
    setActionType(action);
    setShowActionModal(true);
    setReason('');
  };

  const confirmAction = async () => {
    if (actionType === 'deactivate' && !reason.trim()) {
      alert('Reason is required for deactivation');
      return;
    }

    setLoading(true);
    try {
      let result;
      switch (actionType) {
        case 'reset-password':
          result = await userManagementService.forceResetPassword(user.id, reason || 'Admin initiated password reset');
          break;
        case 'unlock':
          result = await userManagementService.unlockAccount(user.id, reason || 'Admin unlocked account');
          break;
        case 'activate':
          result = await userManagementService.activateUser(user.id, reason || 'Admin activated user');
          break;
        case 'deactivate':
          result = await userManagementService.deactivateUser(user.id, reason);
          break;
        default:
          return;
      }

      alert(result.message || 'Action completed successfully');
      setShowActionModal(false);
      setReason('');
      onUserUpdate();
    } catch (error) {
      alert('Action failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (user) => {
    if (!user.isActive) return 'bg-red-500';
    if (user.isLocked) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = (user) => {
    if (!user.isActive) return 'Inactive';
    if (user.isLocked) return 'Locked';
    return 'Active';
  };

  const getActionButtons = () => {
    const buttons = [];
    
    // Password Reset - always available
    buttons.push({
      id: 'reset-password',
      label: 'Reset Password',
      icon: Key,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Send password reset email'
    });

    // Unlock - only if locked
    if (user.isLocked) {
      buttons.push({
        id: 'unlock',
        label: 'Unlock Account',
        icon: Unlock,
        color: 'bg-green-500 hover:bg-green-600',
        description: 'Remove account lock'
      });
    }

    // Activate/Deactivate
    if (user.isActive) {
      buttons.push({
        id: 'deactivate',
        label: 'Deactivate User',
        icon: UserX,
        color: 'bg-red-500 hover:bg-red-600',
        description: 'Disable user access'
      });
    } else {
      buttons.push({
        id: 'activate',
        label: 'Activate User',
        icon: UserCheck,
        color: 'bg-green-500 hover:bg-green-600',
        description: 'Enable user access'
      });
    }

    return buttons;
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(user)} rounded-full border-2 border-white flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{user.name || 'Unknown User'}</h2>
                  <p className="text-blue-100">{user.email || 'No email'}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}>
                      {getStatusText(user)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">{user.roles?.[0] || 'No Role'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.organizationName && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Organization</p>
                        <p className="font-medium">{user.organizationName}</p>
                      </div>
                    </div>
                  )}
                  

                </div>
              </div>

              {/* Status Information */}
              {(!user.isActive || user.isLocked) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Account Status</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {!user.isActive && "This account is currently deactivated."}
                        {user.isLocked && "This account is locked due to failed login attempts."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Available Actions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getActionButtons().map((button) => (
                    <motion.button
                      key={button.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(button.id)}
                      className={`p-4 ${button.color} text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center space-x-3">
                        <button.icon className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">{button.label}</p>
                          <p className="text-xs opacity-90">{button.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Confirmation Modal */}
            <AnimatePresence>
              {showActionModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl p-6 w-full max-w-md"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      Confirm Action
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to {actionType.replace('-', ' ')} for {user.name || 'this user'}?
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason {actionType === 'deactivate' && '(Required)'}
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter reason for this action..."
                        required={actionType === 'deactivate'}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmAction}
                        disabled={loading || (actionType === 'deactivate' && !reason.trim())}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        )}
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;