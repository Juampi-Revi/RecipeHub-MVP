import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from './ProfileSidebar';

export function ProfileLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar className="sticky top-8" />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}