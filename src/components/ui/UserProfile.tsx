import React, { useState, useRef, useEffect } from 'react';
import { User, Settings as SettingsIcon, Bell, LogOut, ChevronRight, X, Edit2, ChevronDown } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface UserProfileProps {
  session: Session;
  handleLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ session, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'profile' | 'settings'>('none');
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = session.user.email || 'yourname@gmail.com';
  const userName = 'Your name'; // Hardcoded for now, could be fetched from profile
  const userInitials = userEmail.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const openModal = (modalName: 'profile' | 'settings') => {
    setActiveModal(modalName);
    setShowDropdown(false); // Close dropdown when opening a modal
  };

  const closeModal = () => setActiveModal('none');

  return (
    <div className="relative z-50 text-black">
      {/* Avatar Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Placeholder for actual image if available */}
        <span className="text-lg">{userInitials}</span>
      </button>

      {/* 1. Dropdown Menu */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {/* User Info Header */}
          <div className="p-5 flex items-center gap-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xl shrink-0 overflow-hidden">
               {userInitials}
            </div>
            <div className="truncate">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{userName}</h4>
              <p className="text-gray-500 text-xs truncate">{userEmail}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => openModal('profile')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <span className="text-sm font-medium">My Profile</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button 
              onClick={() => openModal('settings')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
            >
              <div className="flex items-center gap-3">
                <SettingsIcon size={18} className="text-gray-500" />
                <span className="text-sm font-medium">Settings</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <div className="w-full flex items-center justify-between p-3 text-gray-700">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <span className="text-sm font-medium">Notification</span>
              </div>
              
              {/* Notification Toggle (Allow/Mute) */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                  {notificationsAllowed ? 'Allow' : 'Mute'}
                </button>
                {/* Simple hover submenu for the toggle */}
                <div className="absolute right-0 top-full mt-1 w-24 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 p-1">
                  <button 
                    onClick={() => setNotificationsAllowed(true)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded-lg text-gray-700"
                  >
                    Allow
                  </button>
                  <button 
                    onClick={() => setNotificationsAllowed(false)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 rounded-lg text-gray-700"
                  >
                    Mute
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700 mt-1"
            >
              <LogOut size={18} className="text-gray-500" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-10">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 border-b border-gray-100 pb-6 sm:pb-8 mb-6 sm:mb-8 text-center sm:text-left">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-3xl overflow-hidden border-2 border-white shadow-sm">
                    {userInitials}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <Edit2 size={12} />
                  </button>
                </div>
                <div className="mt-2 sm:mt-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{userName}</h3>
                  <p className="text-gray-500 text-sm sm:text-base">{userEmail}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-gray-50 pb-3 sm:pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-32 shrink-0">Name</span>
                  <input 
                    type="text" 
                    defaultValue="your name" 
                    className="w-full text-left sm:text-right text-gray-900 text-base sm:text-sm focus:outline-none bg-transparent"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-gray-50 pb-3 sm:pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-32 shrink-0">Email account</span>
                  <input 
                    type="text" 
                    defaultValue={userEmail}
                    readOnly
                    className="w-full text-left sm:text-right text-gray-900 text-base sm:text-sm focus:outline-none bg-transparent"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-gray-50 pb-3 sm:pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-32 shrink-0">Mobile number</span>
                  <input 
                    type="text" 
                    placeholder="Add number"
                    className="w-full text-left sm:text-right text-gray-900 text-base sm:text-sm focus:outline-none bg-transparent placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pb-3 sm:pb-4">
                  <span className="text-sm font-medium text-gray-500 sm:w-32 shrink-0">Location</span>
                  <input 
                    type="text" 
                    defaultValue="USA" 
                    className="w-full text-left sm:text-right text-gray-900 text-base sm:text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button 
                  onClick={closeModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                >
                  Save Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Settings</h3>
              <button 
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-gray-600">Language</span>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Eng <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
