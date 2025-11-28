import React, { useState, useEffect } from 'react';
import { fetchChatSessions, deleteConversation, getCollectionDisplayName, getExpertRoute } from '../api/chatHistory';
import { useNavigate } from 'react-router-dom';

export default function ChatHistory({ isOpen, onClose, filterByCollection = null }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, filterByCollection]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChatSessions(filterByCollection);
      setSessions(data.session || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation(); // Prevent triggering the continue conversation
    
    if (!window.confirm('Delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(conversationId);
      await deleteConversation(conversationId);
      setSessions(sessions.filter(s => s.session_id !== conversationId));
    } catch (err) {
      alert('Failed to delete conversation: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = (session) => {
    const route = getExpertRoute(session.collection_name);
    // Navigate with conversation ID as state
    navigate(route, { state: { conversationId: session.session_id } });
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Chat History
            {filterByCollection && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({getCollectionDisplayName(filterByCollection)})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading chat history...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Error: {error}
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">No chat history yet</p>
              <p className="text-sm mt-1">Start a conversation with an expert to see it here!</p>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                  onClick={() => handleContinue(session)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {getCollectionDisplayName(session.collection_name)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(session.session_id, e)}
                        disabled={deletingId === session.session_id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                        title="Delete conversation"
                      >
                        {deletingId === session.session_id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span>Last activity: {formatDate(session.last_activity)}</span>
                      <span className="text-blue-600 font-medium">Click to continue →</span>
                    </div>

                    {/* Preview first message if available */}
                    {session.messages && session.messages.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <span className="font-medium">First message:</span>{' '}
                          {session.messages[0].query || session.messages[0].answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {sessions.length > 0 && `${sessions.length} conversation${sessions.length !== 1 ? 's' : ''} found`}
            </span>
            <button
              onClick={loadHistory}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
