import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateUser } from '../store/slices/authSlice';
import { addToast } from '../store/slices/toastSlice';
import { User as UserIcon, Shield, Bell, Camera, ChevronRight, Mail, Lock, Save } from 'lucide-react';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'security' | 'preferences'>('profile');

  // Form States
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', bio: '' });
  const [emailData, setEmailData] = useState({ currentEmail: '', newEmail: '' });
  
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || ''
      });
      setEmailData(prev => ({ ...prev, currentEmail: user.email }));
    }
  }, [user]);

  // Validation helpers for conditional button visibility
  const isProfileComplete =
    profileData.firstName?.trim() !== '' &&
    profileData.lastName?.trim() !== '' &&
    profileData.bio?.trim() !== '';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid =
    emailData.newEmail?.trim() !== '' &&
    emailPattern.test(emailData.newEmail) &&
    emailData.newEmail !== emailData.currentEmail;

  const isSecurityComplete =
    passwordData.currentPassword?.trim() !== '' &&
    passwordData.newPassword?.trim() !== '' &&
    passwordData.confirmPassword?.trim() !== '' &&
    passwordData.newPassword === passwordData.confirmPassword;

  const handleSaveProfile = () => {
    dispatch(updateUser(profileData));
    dispatch(addToast({ type: 'success', title: 'Profile Updated', message: 'Your info has been saved.' }));
  };

  const handleUpdateEmail = () => {
    dispatch(updateUser({ email: emailData.newEmail }));
    dispatch(addToast({ type: 'success', title: 'Email Changed', message: 'Your email has been updated.' }));
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch(addToast({ type: 'error', title: 'Error', message: 'Passwords do not match.' }));
      return;
    }
    
    dispatch(addToast({ type: 'success', title: 'Security Updated', message: 'Your password has been changed.' }));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: UserIcon },
    { id: 'email', label: 'Email Address', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_45%,_#f8fafc_100%)] dark:bg-[linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)] transition-colors duration-200">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_80px_-25px_rgba(15,23,42,0.25)] backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your personal details, security, and notification preferences in one place.</p>
          </div>
          <div className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-900/40 dark:bg-primary-950/40 dark:text-primary-300">
            Personal workspace
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-72 shrink-0">
          <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-100 p-6 text-center dark:border-gray-700">
              <div className="relative inline-block">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}`} 
                  className="h-24 w-24 rounded-2xl border-4 border-gray-50 object-cover dark:border-gray-900" 
                  alt="Profile"
                />
                <button className="absolute -bottom-2 -right-2 rounded-xl bg-primary-600 p-2 text-white shadow-lg transition-colors hover:bg-primary-700">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="mt-4 font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h2>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <nav className="space-y-1 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={20} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1">
          <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            
            {/* PUBLIC PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Public Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                    <input 
                      value={profileData.firstName} 
                      onChange={e => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                    <input 
                      value={profileData.lastName} 
                      onChange={e => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea 
                    value={profileData.bio} 
                    onChange={e => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    rows={4} 
                  />
                </div>
                {isProfileComplete ? (
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save size={18} /> Save Changes
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse">↑ Fill all required fields to enable Save</div>
                )}
              </div>
            )}

            {/* EMAIL TAB */}
            {activeTab === 'email' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail size={24} className="text-primary-600 dark:text-primary-400" /> Email Settings
                </h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Email</label>
                    <input 
                      disabled 
                      value={emailData.currentEmail} 
                      className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Email Address</label>
                    <input 
                      type="email"
                      value={emailData.newEmail} 
                      onChange={e => setEmailData({...emailData, newEmail: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                      placeholder="Enter new email"
                    />
                  </div>
                  {isEmailValid ? (
                    <Button onClick={handleUpdateEmail}>Update Email Address</Button>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse">↑ Enter a valid new email to continue</div>
                  )}
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lock size={24} className="text-primary-600 dark:text-primary-400" /> Security Settings
                </h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                    />
                  </div>
                  {isSecurityComplete ? (
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse">↑ Fill all fields and ensure passwords match to update</div>
                  )}
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell size={24} className="text-primary-600 dark:text-primary-400" /> Notification Preferences
                </h3>
                <div className="space-y-3">
                  {['emailNotifications', 'smsNotifications', 'newsletter'].map((key) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <input 
                        type="checkbox" 
                        defaultChecked={(user.preferences as any)[key]} 
                        className="w-5 h-5 accent-primary-600 dark:accent-primary-400 rounded" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
