import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { updateUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/toastSlice';
import { Globe, Twitter, Instagram, Github, Save, User as UserIcon, Mail, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

const CreatorSettings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: ''
  });

  const [socials, setSocials] = useState({
    twitter: '',
    instagram: '',
    website: '',
    github: ''
  });

  // Sync state with user data on load
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // Keep password empty for security
        bio: user.bio || ''
      });
      setSocials({
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        website: user.socialLinks?.website || '',
        github: user.socialLinks?.github || ''
      });
    }
  }, [user]);

  const handleSave = () => {
    // Construct update object
    const updatePayload: any = {
      ...formData,
      socialLinks: socials
    };

    // Remove password if it wasn't changed
    if (!formData.password) delete updatePayload.password;

    dispatch(updateUser(updatePayload));
    dispatch(addToast({ 
      type: 'success', 
      title: 'Success', 
      message: 'Creator profile and social links updated' 
    }));
  };

  if (!user) return null;

  // Shared input style for consistency
  const inputClasses = "w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none transition-all";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 transition-colors duration-300">
      {/* Section 1: Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <UserIcon size={24} className="text-primary-600 dark:text-primary-400" /> Personal Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
            <input 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
            <input 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock size={16} /> New Password
            </label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
          <textarea 
            value={formData.bio} 
            onChange={e => setFormData({...formData, bio: e.target.value})}
            rows={3}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Section 2: Social Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Globe size={24} className="text-primary-600 dark:text-primary-400" /> Social Connections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Twitter size={16} className="text-primary-400" /> Twitter
            </label>
            <input 
              value={socials.twitter} 
              onChange={e => setSocials({...socials, twitter: e.target.value})}
              placeholder="twitter.com/username"
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Instagram size={16} className="text-pink-500" /> Instagram
            </label>
            <input 
              value={socials.instagram} 
              onChange={e => setSocials({...socials, instagram: e.target.value})}
              placeholder="instagram.com/username"
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Github size={16} className="text-gray-900 dark:text-white" /> Github
            </label>
            <input 
              value={socials.github} 
              onChange={e => setSocials({...socials, github: e.target.value})}
              placeholder="github.com/username"
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Globe size={16} className="text-emerald-500" /> Website
            </label>
            <input 
              value={socials.website} 
              onChange={e => setSocials({...socials, website: e.target.value})}
              placeholder="https://yourwebsite.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
          <Button 
            onClick={handleSave} 
            className="w-full md:w-auto px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save size={18} />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSettings;
