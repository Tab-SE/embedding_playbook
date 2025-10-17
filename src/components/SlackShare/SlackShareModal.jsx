"use client";

import { useState, useEffect } from 'react';
import { X, MessageSquare, Copy, Share2 } from 'lucide-react';
import Image from 'next/image';

export const SlackShareModal = ({
  isOpen,
  onClose,
  dashboardInfo,
  onSend,
  shareableUrl
}) => {
  const [slackMessage, setSlackMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Available users for Slack sharing
  const slackUsers = [
    { id: 'mike', name: 'Mike Chen', email: 'mchen@veriforce.com', role: 'Procurement Team' },
    { id: 'sarah', name: 'Sarah Johnson', email: 'sjohnson@veriforce.com', role: 'Safety Team' },
    { id: 'lisa', name: 'Lisa Rodriguez', email: 'lrodriguez@veriforce.com', role: 'Management' },
    { id: 'david', name: 'David Kim', email: 'dkim@veriforce.com', role: 'Safety Team' },
    { id: 'jennifer', name: 'Jennifer Martinez', email: 'jmartinez@veriforce.com', role: 'Procurement Team' },
    { id: 'robert', name: 'Robert Wilson', email: 'rwilson@veriforce.com', role: 'Safety Team' }
  ];

  // Generate default message when dashboard info changes
  useEffect(() => {
    if (dashboardInfo && isOpen) {
      const urlToUse = shareableUrl || window.location.href;
      const defaultMessage = `📊 **${dashboardInfo.title}**\n\n${dashboardInfo.description}\n\n🔗 Dashboard URL: ${urlToUse}\n\nView the full dashboard for detailed insights and analytics.`;
      setSlackMessage(defaultMessage);
      setSelectedUser('');
    }
  }, [dashboardInfo, isOpen, shareableUrl]);

  const handleSend = () => {
    if (slackMessage.trim() && selectedUser) {
      const selectedUserData = slackUsers.find(user => user.id === selectedUser);
      onSend({
        message: slackMessage,
        user: selectedUserData,
        dashboard: dashboardInfo
      });
      onClose();
      setSlackMessage('');
      setSelectedUser('');
    } else if (!selectedUser) {
      alert('Please select a user to send the message to.');
    }
  };

  const handleCopyUrl = () => {
    const urlToUse = shareableUrl || window.location.href;
    navigator.clipboard.writeText(urlToUse).then(() => {
      alert('Dashboard URL copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = urlToUse;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Dashboard URL copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Image
              src="/img/themes/veriforce/slack-logo.png"
              alt="Slack"
              width={24}
              height={24}
              className="rounded"
            />
            Share Dashboard via Slack
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Dashboard Info */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-white font-medium">{dashboardInfo?.title}</h4>
                <p className="text-slate-300 text-sm">{dashboardInfo?.description}</p>
              </div>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
                title="Copy dashboard URL"
              >
                <Copy className="h-3 w-3" />
                Copy URL
              </button>
            </div>
            <div className="mt-2 p-2 bg-slate-800 rounded text-xs text-slate-400 font-mono break-all">
              {shareableUrl || (typeof window !== 'undefined' ? window.location.href : '')}
            </div>
          </div>

          {/* User Selection */}
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              Send to:
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a user...</option>
              {slackUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role} ({user.email})
                </option>
              ))}
            </select>
            {selectedUser && (
              <div className="mt-2 p-2 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white">
                    Selected: {slackUsers.find(user => user.id === selectedUser)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">
              Message (Editable):
            </label>
            <textarea
              value={slackMessage}
              onChange={(e) => setSlackMessage(e.target.value)}
              className="w-full h-40 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Enter your Slack message..."
            />
            <p className="text-xs text-slate-500 mt-2">
              💡 Tip: The message includes the dashboard URL automatically. You can edit the text above to customize your message.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-600">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!slackMessage.trim() || !selectedUser}
              className="px-4 py-2 bg-[#4A154B] hover:bg-[#3A0F3A] disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send to Slack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SlackShareButton = ({ dashboardInfo, onShare }) => {
  return (
    <button
      onClick={() => onShare(dashboardInfo)}
      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-lg transition-colors"
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
};
