'use client';

import { usePathname } from 'next/navigation';
import EMRNavigation from './EMRNavigation';
import EMRTopNavigation from './EMRTopNavigation';

interface EMRLayoutWrapperProps {
  children: React.ReactNode;
}

export default function EMRLayoutWrapper({ children }: EMRLayoutWrapperProps) {
  const pathname = usePathname();

  // Determine user role based on current path
  const getUserRole = () => {
    if (pathname.includes('/patient-dashboard')) return 'patient';
    if (pathname.includes('/doctor-dashboard')) return 'doctor';
    if (pathname.includes('/admin-dashboard')) return 'admin';
    // Default to admin for other EMR pages
    return 'admin';
  };

  const getUserName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin User';
      case 'doctor': return 'Dr. Smith';
      case 'patient': return 'Patient User';
      default: return 'User';
    }
  };

  const userRole = getUserRole();
  const userName = getUserName(userRole);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <EMRTopNavigation userRole={userRole} userName={userName} />
      
      {/* Sidebar and Main Content */}
      <div className="flex flex-1 pt-16"> {/* Add top padding to account for fixed top nav */}
        <EMRNavigation userRole={userRole} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
