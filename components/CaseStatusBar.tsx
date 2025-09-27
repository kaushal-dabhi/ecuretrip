'use client'

import { useState } from 'react';
import { Case } from '@/lib/types';
import { CheckCircle, Clock } from 'lucide-react';
import { trackCaseStageChanged } from '@/lib/analytics';

interface CaseStatusBarProps {
  case: Case;
  onStatusChange?: (newStatus: Case['status']) => void;
  isEditable?: boolean;
  showTimeline?: boolean;
}

const CASE_STAGES: Array<{ key: Case['status']; label: string; description: string }> = [
  { key: 'Intake', label: 'Intake', description: 'Initial case setup' },
  { key: 'TeleConsult', label: 'Tele-consult', description: 'Video consultation' },
  { key: 'Deposit', label: 'Deposit', description: 'Escrow payment' },
  { key: 'Visa', label: 'Visa', description: 'Visa processing' },
  { key: 'Admit', label: 'Admission', description: 'Hospital admission' },
  { key: 'Surgery', label: 'Surgery', description: 'Medical procedure' },
  { key: 'Rehab', label: 'Rehabilitation', description: 'Recovery & follow-up' }
];

export default function CaseStatusBar({ 
  case: caseData, 
  onStatusChange,
  isEditable = false,
  showTimeline = true
}: CaseStatusBarProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getCurrentStageIndex = () => {
    return CASE_STAGES.findIndex(stage => stage.key === caseData.status);
  };

  const getStageStatus = (stageIndex: number) => {
    const currentIndex = getCurrentStageIndex();
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStageIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-health" />;
      case 'current':
        return <Clock className="w-5 h-5 text-sky" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-g300 bg-g50"></div>;
    }
  };

  const getStageColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'text-health border-health';
      case 'current':
        return 'text-sky border-sky';
      default:
        return 'text-g400 border-g300';
    }
  };

  const handleStatusChange = async (newStatus: Case['status']) => {
    if (!isEditable || isUpdating) return;
    
    setIsUpdating(true);
    try {
      // Track the status change
      trackCaseStageChanged(caseData.status, newStatus);
      
      // Call the parent handler
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Failed to update case status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-g200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-navy-600">Case Status</h3>
            <p className="text-sm text-g600 mt-1">Case ID: {caseData.id}</p>
          </div>
          
          {/* Current Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            getStageStatus(getCurrentStageIndex()) === 'completed'
              ? 'bg-health/20 text-health-700'
              : getStageStatus(getCurrentStageIndex()) === 'current'
              ? 'bg-sky/20 text-sky-700'
              : 'bg-gold/20 text-gold-700'
          }`}>
            {caseData.status}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-g600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((getCurrentStageIndex() + 1) / CASE_STAGES.length) * 100)}%</span>
          </div>
          <div className="w-full bg-g200 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-mint-400 to-sky rounded-full transition-all duration-500"
              style={{ width: `${((getCurrentStageIndex() + 1) / CASE_STAGES.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {CASE_STAGES.map((stage, index) => {
            const status = getStageStatus(index);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            
            return (
              <div key={stage.key} className="relative">
                {/* Connector line */}
                {index < CASE_STAGES.length - 1 && (
                  <div className={`absolute left-6 top-8 w-0.5 h-8 ${
                    isCompleted ? 'bg-health' : 'bg-g200'
                  }`}></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Stage icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${getStageColor(status)}
                    ${isCurrent ? 'ring-4 ring-sky-200' : ''}
                    transition-all duration-200
                  `}>
                    {getStageIcon(status)}
                  </div>
                  
                  {/* Stage content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${getStageColor(status)}`}>
                          {stage.label}
                        </h4>
                        <p className="text-sm text-g600 mt-1">{stage.description}</p>
                      </div>
                      
                      {/* Status indicator */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCompleted 
                            ? 'bg-health/20 text-health-700'
                            : isCurrent
                            ? 'bg-sky/20 text-sky-700'
                            : 'bg-g300/20 text-g600'
                        }`}>
                          {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                        </span>
                        
                        {/* Edit dropdown for current stage */}
                        {isEditable && isCurrent && (
                          <select
                            value={caseData.status}
                            onChange={(e) => handleStatusChange(e.target.value as Case['status'])}
                            disabled={isUpdating}
                            className="px-3 py-1 text-sm border border-g300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          >
                            {CASE_STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    
                    {/* Current stage indicator */}
                    {isCurrent && (
                      <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                        <div className="flex items-center gap-2 text-sm text-sky-700">
                          <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                          <span className="font-medium">Current stage</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        {showTimeline && caseData.timeline.length > 0 && (
          <div className="mt-8 pt-6 border-t border-g200">
            <h4 className="text-lg font-semibold text-navy-600 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {caseData.timeline.slice(-5).reverse().map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-g50 rounded-lg">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-g700">{event.event}</p>
                    <p className="text-xs text-g500 mt-1">
                      {new Date(event.at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
