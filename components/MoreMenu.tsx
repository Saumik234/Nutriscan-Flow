import React, { useState, useEffect } from 'react';
import { 
  Settings, Info, ShieldAlert, User, LogOut, ChevronRight, FileText, 
  Heart, ChevronLeft, Bell, Moon, Save, ScanBarcode, Mail, Users, 
  Scale, Lock, Send, ExternalLink, MessageCircle
} from 'lucide-react';
import { SupplementData, UserProfile } from '../types';

interface Props {
  onLoadSupplement: (data: SupplementData) => void;
  onNavigateScan: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

type MoreView = 'MENU' | 'PROFILE' | 'SAVED' | 'HISTORY' | 'SETTINGS' | 'DISCLAIMER' | 'ABOUT' | 'ABOUT_US' | 'CONTACT' | 'PRIVACY' | 'TERMS';

const MOCK_HISTORY: SupplementData[] = [
  {
    productName: "Gold Standard Whey",
    brand: "Optimum Nutrition",
    description: "A popular whey protein isolate blend designed for muscle support and recovery.",
    ingredients: [
      { name: "Whey Protein Isolate", efficacyRating: "High", safetyRating: "Safe", description: "Fast-absorbing protein source ideal for post-workout recovery." },
      { name: "BCAAs", efficacyRating: "High", safetyRating: "Safe", description: "Essential amino acids that aid in muscle synthesis." }
    ],
    scientificResearch: "Extensive clinical studies support whey protein's ability to stimulate muscle protein synthesis.",
    safetyConsiderations: "Safe for most adults. Contains dairy/lactose. May cause bloating in sensitive individuals.",
    recommendedDosage: "24-30g protein post-workout.",
    qualityAssessment: "High quality evidence supporting efficacy.",
    overallVerdict: "Excellent choice for muscle building and recovery."
  },
  {
    productName: "Creatine Monohydrate",
    brand: "Generic",
    description: "Micronized creatine powder for strength and power output.",
    ingredients: [
       { name: "Creatine Monohydrate", efficacyRating: "High", safetyRating: "Safe", description: "The most researched form of creatine." }
    ],
    scientificResearch: "Proven to increase physical performance in successive bursts of short-term, high intensity exercise.",
    safetyConsiderations: "Generally safe. Drink plenty of water to avoid cramping.",
    recommendedDosage: "3-5g daily.",
    qualityAssessment: "Gold standard evidence.",
    overallVerdict: "Highly recommended for strength athletes."
  }
];

const MoreMenu: React.FC<Props> = ({ onLoadSupplement, onNavigateScan, userProfile, onUpdateProfile }) => {
  const [currentView, setCurrentView] = useState<MoreView>('MENU');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    setTempProfile(userProfile);
  }, [userProfile]);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false
  });

  const handleProfileSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditingProfile(false);
  };
  
  const handleCancelEdit = () => {
    setTempProfile(userProfile);
    setIsEditingProfile(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
        alert("Signed out successfully.");
        setCurrentView('MENU');
    }
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        { id: 'PROFILE', icon: User, label: 'My Profile', desc: 'Health stats & preferences' },
        { id: 'SAVED', icon: Heart, label: 'Saved Supplements', desc: 'Your favorite products' },
        { id: 'HISTORY', icon: FileText, label: 'Scan History', desc: 'Past analyses' },
      ]
    },
    {
      title: "Preferences & Support",
      items: [
        { id: 'SETTINGS', icon: Settings, label: 'Settings', desc: 'Notifications, Dark mode' },
        { id: 'CONTACT', icon: Mail, label: 'Contact Support', desc: 'Get help or send feedback' },
      ]
    },
    {
      title: "About & Legal",
      items: [
        { id: 'ABOUT_US', icon: Users, label: 'About Us', desc: 'Our mission and team' },
        { id: 'DISCLAIMER', icon: ShieldAlert, label: 'Medical Disclaimer', desc: 'Important safety info' },
        { id: 'PRIVACY', icon: Lock, label: 'Privacy Policy', desc: 'How we handle your data' },
        { id: 'TERMS', icon: Scale, label: 'Terms & Conditions', desc: 'Agreement and usage rules' },
        { id: 'ABOUT', icon: Info, label: 'App Info', desc: 'Version 1.0.0' },
      ]
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'PROFILE':
        return (
           <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold border border-emerald-200 uppercase">
                    {tempProfile.name.charAt(0)}
                 </div>
                 <div className="flex-1">
                   {isEditingProfile ? (
                     <div className="mb-2">
                       <label className="text-xs text-gray-400 block">Name</label>
                       <input 
                         value={tempProfile.name} 
                         onChange={e => setTempProfile({...tempProfile, name: e.target.value})}
                         className="font-bold text-lg text-gray-900 border-b border-emerald-300 focus:border-emerald-600 outline-none w-full py-1"
                         autoFocus
                       />
                     </div>
                   ) : (
                     <h3 className="font-bold text-lg text-gray-900">{userProfile.name}</h3>
                   )}
                   <p className="text-emerald-600 text-sm font-medium">Pro Member</p>
                 </div>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Health Goal</label>
                   {isEditingProfile ? (
                     <input value={tempProfile.goal} onChange={e => setTempProfile({...tempProfile, goal: e.target.value})} className="w-full bg-white border border-emerald-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-100 outline-none" />
                   ) : (
                     <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 font-medium">{userProfile.goal}</div>
                   )}
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Age</label>
                   {isEditingProfile ? (
                     <input value={tempProfile.age} type="number" onChange={e => setTempProfile({...tempProfile, age: e.target.value})} className="w-full bg-white border border-emerald-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-100 outline-none" />
                   ) : (
                     <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 font-medium">{userProfile.age}</div>
                   )}
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dietary Restrictions</label>
                   {isEditingProfile ? (
                     <input value={tempProfile.restriction} onChange={e => setTempProfile({...tempProfile, restriction: e.target.value})} className="w-full bg-white border border-emerald-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-emerald-100 outline-none" />
                   ) : (
                     <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 font-medium">{userProfile.restriction}</div>
                   )}
                 </div>
               </div>
             </div>
             {isEditingProfile ? (
                <div className="flex gap-3">
                   <button onClick={handleCancelEdit} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                   <button onClick={handleProfileSave} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"><Save size={18} /> Save Changes</button>
                </div>
             ) : (
                <button onClick={() => setIsEditingProfile(true)} className="w-full py-3 bg-white border border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors">Edit Profile</button>
             )}
           </div>
        );
      case 'ABOUT_US':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
              <p className="text-gray-500 text-sm mt-2">Empowering health through science-backed data.</p>
            </div>
            <div className="prose prose-sm text-gray-600 space-y-4">
              <p>NutriScan AI was founded by a team of clinical nutritionists and AI engineers who realized that the supplement industry is often confusing and poorly regulated.</p>
              <p>Our goal is to bring transparency to the market by providing instant, evidence-based analysis of every supplement you encounter. We believe everyone deserves to know exactly what they are putting into their bodies.</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                 <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-emerald-600 font-bold text-lg">50k+</div>
                    <div className="text-xs text-gray-400">Products Analyzed</div>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-emerald-600 font-bold text-lg">99.9%</div>
                    <div className="text-xs text-gray-400">Science Accuracy</div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'CONTACT':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
            {contactSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <Send size={32} className="animate-bounce" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-sm mt-2">We'll get back to you within 24 hours.</p>
                <button onClick={() => setContactSubmitted(false)} className="mt-6 text-emerald-600 font-medium">Send another message</button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">Have a question or feedback? We'd love to hear from you.</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Email</label>
                  <input type="email" placeholder="email@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message</label>
                  <textarea rows={4} placeholder="How can we help you?" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <button 
                  onClick={() => setContactSubmitted(true)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
                <div className="pt-4 flex items-center justify-center gap-6">
                   <button className="text-emerald-600 flex items-center gap-1 text-sm font-medium"><MessageCircle size={16}/> Live Chat</button>
                   <button className="text-emerald-600 flex items-center gap-1 text-sm font-medium"><ExternalLink size={16}/> FAQ</button>
                </div>
              </div>
            )}
          </div>
        );
      case 'PRIVACY':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in text-sm text-gray-600 leading-relaxed">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Privacy Policy</h3>
            <p className="mb-4">At NutriScan AI, we take your privacy seriously. This policy explains how we collect, use, and protect your information.</p>
            <h4 className="font-semibold text-gray-800 mb-2">1. Data Collection</h4>
            <p className="mb-4">We collect images you scan and health profile data you provide to give accurate supplement recommendations.</p>
            <h4 className="font-semibold text-gray-800 mb-2">2. Usage</h4>
            <p className="mb-4">Your data is used solely for enhancing your experience and is never sold to third-party supplement manufacturers.</p>
            <h4 className="font-semibold text-gray-800 mb-2">3. Security</h4>
            <p className="mb-4">We use industry-standard encryption to protect your profile and scan history.</p>
            <p className="mt-6 text-xs text-gray-400 italic">Last updated: May 2024</p>
          </div>
        );
      case 'TERMS':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in text-sm text-gray-600 leading-relaxed">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Terms & Conditions</h3>
            <p className="mb-4">By using NutriScan AI, you agree to the following terms. Please read them carefully.</p>
            <h4 className="font-semibold text-gray-800 mb-2">1. No Medical Advice</h4>
            <p className="mb-4">The content provided is for informational purposes only. It is not a substitute for professional medical diagnosis or treatment.</p>
            <h4 className="font-semibold text-gray-800 mb-2">2. User Responsibility</h4>
            <p className="mb-4">You are responsible for consulting a physician before starting any new supplement regimen based on our data.</p>
            <h4 className="font-semibold text-gray-800 mb-2">3. Limitation of Liability</h4>
            <p className="mb-4">NutriScan AI is not liable for any adverse reactions or health complications resulting from supplement use.</p>
          </div>
        );
      case 'SAVED':
        return (
          <div className="text-center py-12 animate-fade-in bg-white rounded-xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Heart size={32} />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No Saved Items</h3>
            <p className="text-gray-500 text-sm mb-6">Supplements you bookmark will appear here.</p>
            <button onClick={onNavigateScan} className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm hover:bg-emerald-700 transition-colors"><ScanBarcode size={16} /> Scan Products</button>
          </div>
        );
      case 'HISTORY':
        return (
          <div className="space-y-3 animate-fade-in">
             <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">Recent Scans</span>
                <span className="text-xs text-emerald-600 cursor-pointer">Clear All</span>
             </div>
             {MOCK_HISTORY.map((item, idx) => (
               <div key={idx} onClick={() => onLoadSupplement(item)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{item.productName}</h4>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" size={18} />
               </div>
             ))}
          </div>
        );
      case 'SETTINGS':
        return (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fade-in shadow-sm">
            <div onClick={() => toggleSetting('notifications')} className="p-4 flex items-center justify-between border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={18} /></div>
                <span className="font-medium text-gray-700">Notifications</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
             <div onClick={() => toggleSetting('darkMode')} className="p-4 flex items-center justify-between border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Moon size={18} /></div>
                <span className="font-medium text-gray-700">Dark Mode</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        );
      case 'DISCLAIMER':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in text-sm leading-relaxed text-gray-600">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100"><ShieldAlert className="text-red-500" size={20}/> Medical Disclaimer</h3>
            <p className="mb-4">The content provided by NutriScan AI is for informational and educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
            <p className="mb-4">Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition, dietary changes, or supplement use.</p>
            <p className="mb-0 font-medium text-gray-800">Never disregard professional medical advice or delay in seeking it because of something you have read on this application.</p>
          </div>
        );
      case 'ABOUT':
        return (
           <div className="text-center py-8 animate-fade-in">
             <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-emerald-200">N</div>
             <h2 className="font-bold text-2xl text-gray-900 mb-1">NutriScan AI</h2>
             <p className="text-gray-500 font-medium mb-8">Version 1.0.0</p>
             <div className="bg-white rounded-xl border border-gray-100 p-4 text-left shadow-sm max-w-sm mx-auto">
                 <p className="text-sm text-gray-600 leading-relaxed text-center">Powered by <strong>Google Gemini 2.5 Flash</strong>.<br/>Designed to simplify supplement science and help you achieve your health goals safely.</p>
             </div>
             <p className="text-xs text-gray-400 mt-8">&copy; 2024 NutriScan Inc.</p>
           </div>
        );
      default:
        return null;
    }
  }

  if (currentView !== 'MENU') {
      return (
        <div className="max-w-2xl mx-auto animate-fade-in px-4">
           <button onClick={() => setCurrentView('MENU')} className="mb-4 flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors font-medium text-sm group">
             <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
           </button>
           <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">{menuSections.flatMap(s => s.items).find(i => i.id === currentView)?.label || 'View'}</h2></div>
           {renderContent()}
        </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">More Options</h2>
        <p className="text-gray-500">Manage your account and app preferences.</p>
      </div>

      <div className="space-y-6">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx}>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{section.title}</h4>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {section.items.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentView(item.id as MoreView)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center transition-all">
                      <item.icon size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{item.label}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSignOut} className="w-full mt-8 bg-white border border-red-100 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-red-50 transition-colors shadow-sm active:scale-95 transform">
        <LogOut size={20} /> Sign Out
      </button>

      <div className="mt-12 text-center pb-8">
        <p className="text-xs text-gray-400">NutriScan AI &copy; 2024</p>
      </div>
    </div>
  );
};

export default MoreMenu;