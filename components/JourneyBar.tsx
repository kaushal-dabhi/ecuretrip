'use client';

import { JourneyStage } from '@/types/oncology';
import { 
  Search, 
  FileText, 
  Brain, 
  Calendar, 
  Heart, 
  CheckCircle, 
  Shield 
} from 'lucide-react';

interface JourneyBarProps {
  currentStage: JourneyStage;
  onStageClick?: (stage: JourneyStage) => void;
}

const stages: Array<{
  stage: JourneyStage;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  {
    stage: 'Inquiry',
    label: 'Inquiry',
    icon: Search,
    description: 'Initial consultation and tumor type selection'
  },
  {
    stage: 'Assessment',
    label: 'Assessment',
    icon: FileText,
    description: 'Medical reports, staging, and biomarkers'
  },
  {
    stage: 'Planning',
    label: 'Planning',
    icon: Brain,
    description: 'Treatment plan and specialist matching'
  },
  {
    stage: 'Scheduled',
    label: 'Scheduled',
    icon: Calendar,
    description: 'Appointment booking and payment'
  },
  {
    stage: 'InTreatment',
    label: 'In Treatment',
    icon: Heart,
    description: 'Active treatment and monitoring'
  },
  {
    stage: 'PostTreatment',
    label: 'Post Treatment',
    icon: CheckCircle,
    description: 'Recovery and follow-up planning'
  },
  {
    stage: 'Completed',
    label: 'Completed',
    icon: Shield,
    description: 'Treatment completed and records exported'
  }
];

export function JourneyBar({ currentStage, onStageClick }: JourneyBarProps) {
  const currentIndex = stages.findIndex(s => s.stage === currentStage);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Your Treatment Journey</h2>
      
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = stage.stage === currentStage;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={stage.stage} className="flex flex-col items-center flex-1">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isActive ? 'bg-[#145263] text-white' :
                  isCompleted ? 'bg-[#83B990] text-white' :
                  'bg-gray-200 text-gray-600'
                }`}
                onClick={() => onStageClick?.(stage.stage)}
                style={{ cursor: onStageClick ? 'pointer' : 'default' }}
              >
                <Icon className="w-6 h-6" />
              </div>
              
              <span className={`text-sm font-medium text-center ${
                isActive ? 'text-[#145263]' :
                isCompleted ? 'text-[#83B990]' :
                'text-gray-500'
              }`}>
                {stage.label}
              </span>
              
              <div className="w-full h-0.5 mt-2 bg-gray-200">
                {isCompleted && (
                  <div className="h-full bg-[#83B990] transition-all duration-300" />
                )}
              </div>
              
              {/* Tooltip */}
              <div className="relative group">
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {stage.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current stage description */}
      <div className="mt-4 p-3 bg-[#FFF3D4] rounded-lg">
        <p className="text-sm text-slate-700">
          <strong>Current Stage:</strong> {stages.find(s => s.stage === currentStage)?.description}
        </p>
      </div>
    </div>
  );
}
