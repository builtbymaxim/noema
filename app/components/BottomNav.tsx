import { Home, PieChart, User, Plus } from 'lucide-react';
import { useAppContext } from '../App';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onPlusClick?: () => void;
}

export function BottomNav({ currentTab, onTabChange, onPlusClick }: BottomNavProps) {
  const { darkMode } = useAppContext();

  const bgColor = darkMode ? 'bg-[#1a1a1a]/90' : 'bg-white/80';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';
  const activeColor = darkMode ? 'text-amber-400' : 'text-[#6b5344]';
  const inactiveColor = darkMode ? 'text-gray-500' : 'text-gray-400';
  const plusBg = darkMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-[#6b5344] hover:bg-[#5a4535]';

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${bgColor} backdrop-blur-lg border-t ${borderColor} pb-6 pt-2 z-30 transition-colors duration-300`}>
      <div className="flex items-center justify-around px-6">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'home' ? activeColor : inactiveColor
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => onTabChange('insights')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'insights' ? activeColor : inactiveColor
          }`}
        >
          <PieChart className="w-6 h-6" />
          <span className="text-xs">Insights</span>
        </button>

        <button
          onClick={onPlusClick}
          className="flex flex-col items-center gap-1 -mt-8 relative"
        >
          {/* Pulse ring animation */}
          <div className={`absolute w-14 h-14 rounded-full ${darkMode ? 'bg-amber-500' : 'bg-[#6b5344]'} animate-ping opacity-30`} style={{ animationDuration: '2s', animationIterationCount: '3' }} />
          <div className={`absolute w-14 h-14 rounded-full ${darkMode ? 'bg-amber-500/20' : 'bg-[#6b5344]/20'} animate-pulse`} style={{ animationDuration: '2s' }} />
          <div className={`relative w-14 h-14 ${plusBg} rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95`}>
            <Plus className="w-7 h-7 text-white" />
          </div>
        </button>

        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'calendar' ? activeColor : inactiveColor
          }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="text-xs">Calendar</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'profile' ? activeColor : inactiveColor
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}