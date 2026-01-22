import { X, EyeOff, ChevronRight, Plus, BarChart2, Calendar, Sparkles, ArrowDown, Lightbulb, TrendingUp, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export type HelperType = 'tip' | 'insight' | 'reminder';

export interface HelperConfig {
  id: string;
  type?: HelperType; // Default: 'tip'
  message: string;
  actionLabel?: string;
  actionIcon?: 'plus' | 'chart' | 'calendar' | 'sparkles';
  onAction?: () => void;
  highlightPlusButton?: boolean;
  autoDismissSeconds?: number; // Custom auto-dismiss time, default 12
}

interface HelperProps {
  helper: HelperConfig;
  darkMode: boolean;
  onDismiss: () => void;
  onNeverShow: () => void;
}

// Helper type configurations
const helperTypeConfig = {
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    lightBg: 'bg-amber-50',
    lightIconBg: 'bg-amber-100',
    lightIconColor: 'text-amber-600',
    lightLabelColor: 'text-amber-700/70',
    lightBorder: 'border-amber-200',
    lightProgressBg: 'bg-[#a58872]/40',
    darkBg: 'bg-amber-900/20',
    darkIconBg: 'bg-amber-900/40',
    darkIconColor: 'text-amber-400',
    darkLabelColor: 'text-amber-400/80',
    darkBorder: 'border-amber-800/30',
    darkProgressBg: 'bg-amber-600/60',
  },
  insight: {
    icon: TrendingUp,
    label: 'Insight',
    lightBg: 'bg-blue-50',
    lightIconBg: 'bg-blue-100',
    lightIconColor: 'text-blue-600',
    lightLabelColor: 'text-blue-700/70',
    lightBorder: 'border-blue-200',
    lightProgressBg: 'bg-blue-400/40',
    darkBg: 'bg-blue-900/20',
    darkIconBg: 'bg-blue-900/40',
    darkIconColor: 'text-blue-400',
    darkLabelColor: 'text-blue-400/80',
    darkBorder: 'border-blue-800/30',
    darkProgressBg: 'bg-blue-600/60',
  },
  reminder: {
    icon: Bell,
    label: 'Reminder',
    lightBg: 'bg-purple-50',
    lightIconBg: 'bg-purple-100',
    lightIconColor: 'text-purple-600',
    lightLabelColor: 'text-purple-700/70',
    lightBorder: 'border-purple-200',
    lightProgressBg: 'bg-purple-400/40',
    darkBg: 'bg-purple-900/20',
    darkIconBg: 'bg-purple-900/40',
    darkIconColor: 'text-purple-400',
    darkLabelColor: 'text-purple-400/80',
    darkBorder: 'border-purple-800/30',
    darkProgressBg: 'bg-purple-600/60',
  },
};

export function Helper({ helper, darkMode, onDismiss, onNeverShow }: HelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const type = helper.type || 'tip';
  const config = helperTypeConfig[type];
  const IconComponent = config.icon;
  const autoDismissMs = (helper.autoDismissSeconds || 12) * 1000;

  useEffect(() => {
    // Animate in with a slight delay for more noticeable entrance
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss with progress indicator
  useEffect(() => {
    if (!isVisible || isExiting) return;

    const interval = 100;
    const step = (interval / autoDismissMs) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          handleDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [isVisible, isExiting, autoDismissMs]);

  const handleDismiss = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(onDismiss, 400);
  };

  const handleNeverShow = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(onNeverShow, 400);
  };

  const handleAction = () => {
    if (helper.onAction) {
      setIsExiting(true);
      setTimeout(() => {
        helper.onAction?.();
        onDismiss();
      }, 300);
    }
  };

  const getActionIcon = () => {
    switch (helper.actionIcon) {
      case 'plus': return <Plus className="w-4 h-4" />;
      case 'chart': return <BarChart2 className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`absolute bottom-24 left-4 right-4 z-40 transition-all ease-out ${
        isVisible && !isExiting
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95'
      }`}
      style={{ transitionDuration: isExiting ? '400ms' : '600ms' }}
    >
      {/* Main helper card */}
      <div
        className={`rounded-2xl overflow-hidden shadow-xl border-2 ${
          darkMode
            ? `bg-[#2a2520] ${config.darkBorder}`
            : `bg-white ${config.lightBorder}`
        }`}
      >
        {/* Progress bar at top */}
        <div className={`h-1 ${darkMode ? 'bg-[#1a1510]' : 'bg-gray-100'}`}>
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              darkMode ? config.darkProgressBg : config.lightProgressBg
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4">
          {/* Type header */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              darkMode ? config.darkIconBg : config.lightIconBg
            }`}>
              <IconComponent className={`w-3.5 h-3.5 ${darkMode ? config.darkIconColor : config.lightIconColor}`} />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wide ${
              darkMode ? config.darkLabelColor : config.lightLabelColor
            }`}>
              {config.label}
            </span>
          </div>

          <div className="flex items-start gap-3">
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-[#2a2520]'}`}>
                {helper.message}
              </p>

              {/* Action button - only show if not highlighting plus button */}
              {helper.actionLabel && !helper.highlightPlusButton && (
                <button
                  onClick={handleAction}
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? `${config.darkIconBg} ${config.darkIconColor} hover:opacity-80`
                      : 'bg-[#a58872] text-white hover:bg-[#8b7355]'
                  }`}
                >
                  {getActionIcon()}
                  {helper.actionLabel}
                </button>
              )}
            </div>

            {/* Dismiss buttons */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={handleDismiss}
                className={`p-1.5 rounded-full transition-colors ${
                  darkMode
                    ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleNeverShow}
                className={`p-1.5 rounded-full transition-colors ${
                  darkMode
                    ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
                title="Don't show again"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow pointing to + button */}
      {helper.highlightPlusButton && (
        <div className="flex justify-center mt-3">
          <div className="animate-bounce">
            <ArrowDown className={`w-7 h-7 ${darkMode ? 'text-amber-400' : 'text-[#a58872]'}`} />
          </div>
        </div>
      )}
    </div>
  );
}
