import { Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface SLAStat {
  metric: string;
  target: string;
  current: string;
  status: 'on-track' | 'at-risk' | 'breached';
  description: string;
}

interface SLAStatsProps {
  stats: SLAStat[];
  variant?: 'default' | 'compact' | 'detailed';
  showTrends?: boolean;
}

export default function SLAStats({ 
  stats, 
  variant = 'default',
  showTrends = false 
}: SLAStatsProps) {
  const getStatusColor = (status: SLAStat['status']) => {
    switch (status) {
      case 'on-track':
        return 'text-health border-health bg-health/10';
      case 'at-risk':
        return 'text-gold border-gold bg-gold/10';
      case 'breached':
        return 'text-alert border-alert bg-alert/10';
      default:
        return 'text-g600 border-g300 bg-g50';
    }
  };

  const getStatusIcon = (status: SLAStat['status']) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="w-5 h-5 text-health" />;
      case 'at-risk':
        return <AlertTriangle className="w-5 h-5 text-gold" />;
      case 'breached':
        return <Clock className="w-5 h-5 text-alert" />;
      default:
        return <Clock className="w-5 h-5 text-g600" />;
    }
  };

  const getStatusLabel = (status: SLAStat['status']) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'at-risk':
        return 'At Risk';
      case 'breached':
        return 'Breached';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-g200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-navy-600">Service Level Agreements</h3>
            <p className="text-sm text-g600 mt-1">Performance metrics and targets</p>
          </div>
          
          {showTrends && (
            <div className="flex items-center gap-2 text-sm text-g600">
              <TrendingUp className="w-4 h-4" />
              <span>Live monitoring</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-4 ${
          variant === 'compact' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${getStatusColor(stat.status)}
                ${variant === 'detailed' ? 'hover:shadow-md' : ''}
              `}
            >
              {/* Metric Header */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-navy-600">{stat.metric}</h4>
                <div className="flex items-center gap-2">
                  {getStatusIcon(stat.status)}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.status === 'on-track' 
                      ? 'bg-health/20 text-health-700'
                      : stat.status === 'at-risk'
                      ? 'bg-gold/20 text-gold-700'
                      : 'bg-alert/20 text-alert-700'
                  }`}>
                    {getStatusLabel(stat.status)}
                  </span>
                </div>
              </div>

              {/* Current vs Target */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-g600">Current:</span>
                  <span className="font-medium text-navy-600">{stat.current}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-g600">Target:</span>
                  <span className="font-medium text-navy-600">{stat.target}</span>
                </div>
              </div>

              {/* Description */}
              {variant !== 'compact' && (
                <p className="text-xs text-g600 mt-3 leading-relaxed">
                  {stat.description}
                </p>
              )}

              {/* Progress Bar for detailed view */}
              {variant === 'detailed' && (
                <div className="mt-3">
                  <div className="w-full bg-g200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        stat.status === 'on-track' 
                          ? 'bg-health' 
                          : stat.status === 'at-risk'
                          ? 'bg-gold'
                          : 'bg-alert'
                      }`}
                      style={{ 
                        width: stat.status === 'on-track' ? '100%' : 
                               stat.status === 'at-risk' ? '75%' : '50%' 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {variant === 'detailed' && (
          <div className="mt-6 pt-4 border-t border-g200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-health">
                  {stats.filter(s => s.status === 'on-track').length}
                </div>
                <div className="text-sm text-g600">On Track</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">
                  {stats.filter(s => s.status === 'at-risk').length}
                </div>
                <div className="text-sm text-g600">At Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-alert">
                  {stats.filter(s => s.status === 'breached').length}
                </div>
                <div className="text-sm text-g600">Breached</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-g200">
          <div className="flex items-center justify-between text-sm text-g600">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>NPS Target: ≥70</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined SLA metrics for eCureTrip
export const DEFAULT_SLA_STATS: SLAStat[] = [
  {
    metric: 'Quote Response',
    target: '< 24 hours',
    current: '18 hours',
    status: 'on-track',
    description: 'Time to provide initial quote after intake submission'
  },
  {
    metric: 'Tele-consult Booking',
    target: '< 48 hours',
    current: '36 hours',
    status: 'on-track',
    description: 'Time to schedule tele-consultation after quote acceptance'
  },
  {
    metric: 'Visa Letter Generation',
    target: '< 24 hours',
    current: '22 hours',
    status: 'on-track',
    description: 'Time to generate visa letter after escrow deposit'
  },
  {
    metric: 'Refund Processing',
    target: '< 72 hours',
    current: '48 hours',
    status: 'on-track',
    description: 'Time to process refunds for cancelled cases'
  },
  {
    metric: 'Patient Satisfaction',
    target: '≥ 4.5/5',
    current: '4.7/5',
    status: 'on-track',
    description: 'Average patient rating across all completed cases'
  },
  {
    metric: 'Case Completion',
    target: '≥ 95%',
    current: '92%',
    status: 'at-risk',
    description: 'Percentage of cases completed successfully within timeline'
  }
];

