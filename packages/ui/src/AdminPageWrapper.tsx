import React from 'react';
import { AdminNavigationOverlay } from './AdminNavigationOverlay';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-100 ${className}`}>
      {/* Admin Navigation Overlay */}
      <AdminNavigationOverlay />
      
      {/* Main Content */}
      <div className="w-full max-w-[2000px] mx-auto px-4 py-6 relative z-10">
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-amber-500/10 dark:border-amber-400/10 p-4 md:p-6 relative overflow-hidden">
          {/* Persian-inspired corner decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-tr-3xl"></div>
          
          <div className="p-6 space-y-6 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageWrapper;
