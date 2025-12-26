import React, { useState } from 'react';
import { ScanBarcode, Search, MessageSquare, Menu, Home as HomeIcon } from 'lucide-react';
import BarcodeScanner from './components/BarcodeScanner';
import AIConsultant from './components/AIConsultant';
import SupplementSearch from './components/SupplementSearch';
import SupplementDetail from './components/SupplementDetail';
import MoreMenu from './components/MoreMenu';
import { SupplementData, AppView, UserProfile } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [scannedData, setScannedData] = useState<SupplementData | null>(null);
  
  // Lifted Profile State for persistence
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    goal: "Muscle Gain & Energy",
    age: "28",
    restriction: "Gluten Free"
  });

  const handleScanComplete = (data: SupplementData) => {
    setScannedData(data);
    setCurrentView(AppView.HOME); // Go back to home to show result
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setScannedData(null); // Clear detail when changing views
      }}
      className={`flex flex-col items-center justify-center space-y-1 w-full py-3 ${
        currentView === view ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            N
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">NutriScan<span className="text-emerald-500">AI</span></h1>
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        
        {/* Render Views */}
        {currentView === AppView.HOME && (
          <div className="space-y-8 animate-fade-in">
            {scannedData ? (
              <div className="space-y-4">
                 <button onClick={() => setScannedData(null)} className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1">
                   &larr; Back to Dashboard
                 </button>
                 <SupplementDetail data={scannedData} onClose={() => setScannedData(null)} />
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Make Informed Choices</h2>
                    <p className="text-emerald-50 mb-6 max-w-sm">Scan supplement barcodes or search our database for instant scientific efficacy reviews.</p>
                    <button 
                      onClick={() => setCurrentView(AppView.SCANNER)}
                      className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <ScanBarcode size={20} /> Scan Product
                    </button>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <ScanBarcode size={200} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setCurrentView(AppView.SEARCH)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Search size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Search Database</h3>
                    <p className="text-gray-500 text-sm">Find reviews by ingredient, brand, or product name.</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView(AppView.CONSULTANT)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">AI Consultant</h3>
                    <p className="text-gray-500 text-sm">Chat about your goals to get personalized recommendations.</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-800 mb-4">Trending Scans</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="min-w-[200px] h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === AppView.SEARCH && <SupplementSearch />}
        
        {currentView === AppView.CONSULTANT && <AIConsultant />}
        
        {currentView === AppView.MORE && (
          <MoreMenu 
            onLoadSupplement={handleScanComplete}
            onNavigateScan={() => setCurrentView(AppView.SCANNER)}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}

      </main>

      {/* Full Screen Scanner Overlay */}
      {currentView === AppView.SCANNER && (
        <BarcodeScanner 
          onScanComplete={handleScanComplete} 
          onClose={() => setCurrentView(AppView.HOME)} 
        />
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden flex justify-around items-center z-20 pb-safe">
        <NavButton view={AppView.HOME} icon={HomeIcon} label="Home" />
        <NavButton view={AppView.SEARCH} icon={Search} label="Search" />
        <div className="relative -top-5">
           <button 
             onClick={() => setCurrentView(AppView.SCANNER)}
             className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-700 transition-colors"
           >
             <ScanBarcode size={28} />
           </button>
        </div>
        <NavButton view={AppView.CONSULTANT} icon={MessageSquare} label="Consultant" />
        <NavButton view={AppView.MORE} icon={Menu} label="More" />
      </nav>
    </div>
  );
};

export default App;