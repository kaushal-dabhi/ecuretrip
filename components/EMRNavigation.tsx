'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Users,
  Activity,
  Settings,
  Database,
  Shield,
  BarChart3,
  Calendar,
  Upload,
  Search,
  Target,
  GitBranch,
  User,
  Stethoscope,
  Brain
} from 'lucide-react';

interface EMRNavigationProps {
  userRole?: 'admin' | 'doctor' | 'patient';
}

const EMRNavigation: React.FC<EMRNavigationProps> = ({ userRole = 'admin' }) => {
  const pathname = usePathname();

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'Search',
        href: '/emr/search',
        icon: Search,
        description: 'Search across all data',
        roles: ['admin', 'doctor', 'patient']
      },
      {
        name: 'Settings',
        href: '/emr/settings',
        icon: Settings,
        description: 'System configuration',
        roles: ['admin', 'doctor', 'patient']
      }
    ];

    const roleSpecificItems = {
      admin: [
        {
          name: 'Admin Dashboard',
          href: '/emr/admin-dashboard',
          icon: BarChart3,
          description: 'Overview and analytics'
        },
        {
          name: 'Patients',
          href: '/emr/patients',
          icon: Users,
          description: 'Patient management'
        },
        {
          name: 'Doctors',
          href: '/emr/doctors',
          icon: Stethoscope,
          description: 'Doctor profiles and schedules'
        },
        {
          name: 'Oncology Cases',
          href: '/emr/cases',
          icon: FileText,
          description: 'Case management'
        },
        {
          name: 'FHIR Resources',
          href: '/emr/fhir',
          icon: Database,
          description: 'FHIR compliance and data'
        },
        {
          name: 'AI Matching',
          href: '/emr/ai-matching',
          icon: Brain,
          description: 'AI-powered matching'
        },
        {
          name: 'Workflows',
          href: '/emr/workflows',
          icon: GitBranch,
          description: 'Automated workflows'
        },
        {
          name: 'Analytics',
          href: '/emr/analytics',
          icon: Activity,
          description: 'Performance metrics'
        }
      ],
      doctor: [
        {
          name: 'Doctor Dashboard',
          href: '/emr/doctor-dashboard',
          icon: Stethoscope,
          description: 'Doctor workspace'
        },
        {
          name: 'My Cases',
          href: '/emr/cases',
          icon: FileText,
          description: 'Assigned cases'
        },
        {
          name: 'Patients',
          href: '/emr/patients',
          icon: Users,
          description: 'Patient records'
        },
        {
          name: 'AI Matching',
          href: '/emr/ai-matching',
          icon: Brain,
          description: 'AI-powered matching'
        }
      ],
      patient: [
        {
          name: 'Patient Dashboard',
          href: '/emr/patient-dashboard',
          icon: User,
          description: 'Patient portal'
        },
        {
          name: 'My Cases',
          href: '/emr/cases',
          icon: FileText,
          description: 'My medical cases'
        },
        {
          name: 'Upload Documents',
          href: '/emr/upload',
          icon: Upload,
          description: 'Upload medical records'
        }
      ]
    };

    return [...roleSpecificItems[userRole], ...baseItems.filter(item => item.roles.includes(userRole))];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {userRole === 'admin' && 'EMR Admin'}
              {userRole === 'doctor' && 'Doctor Portal'}
              {userRole === 'patient' && 'Patient Portal'}
            </h1>
            <p className="text-sm text-slate-600">
              {userRole === 'admin' && 'System Management'}
              {userRole === 'doctor' && 'Healthcare Workspace'}
              {userRole === 'patient' && 'Your Health Journey'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {userRole === 'admin' && (
              <>
                <Link
                  href="/emr/ai-matching"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span>New AI Match</span>
                </Link>
                <Link
                  href="/emr/workflows"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Create Workflow</span>
                </Link>
              </>
            )}
            {userRole === 'doctor' && (
              <>
                <Link
                  href="/emr/cases"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>New Case</span>
                </Link>
                <Link
                  href="/emr/ai-matching"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span>Find Match</span>
                </Link>
              </>
            )}
            {userRole === 'patient' && (
              <>
                <Link
                  href="/emr/upload"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Document</span>
                </Link>
                <Link
                  href="/emr/cases"
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>View My Cases</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EMRNavigation;
