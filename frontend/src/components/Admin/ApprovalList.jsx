// src/components/Admin/ApprovalList.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCheck, faTimes, faSpinner, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { getPendingApprovals, approveEmployee, rejectEmployee } from '../../services/api';

const ApprovalList = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const data = await getPendingApprovals();
      setPendingRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employeeId) => {
    setActionLoading(employeeId);
    try {
      await approveEmployee(employeeId);
      setPendingRequests(prev => prev.filter(req => req.id !== employeeId));
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (employeeId) => {
    setActionLoading(employeeId);
    try {
      await rejectEmployee(employeeId);
      setPendingRequests(prev => prev.filter(req => req.id !== employeeId));
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon icon={faSpinner} className="text-purple-500 text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
          <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
            {pendingRequests.length} Pending
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-500 text-5xl mb-4" />
            <p className="text-gray-400 text-lg">No pending approvals</p>
            <p className="text-gray-500 text-sm mt-2">All employee requests have been processed</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{request.name}</h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            {request.email}
                          </div>
                        </div>
                      </div>
                      <div className="ml-15 text-sm text-gray-400">
                        Requested on: {new Date(request.requestedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center"
                      >
                        {actionLoading === request.id ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                            Approve
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center"
                      >
                        {actionLoading === request.id ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Reject
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ApprovalList;
