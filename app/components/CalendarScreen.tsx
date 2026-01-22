import { ChevronLeft, ChevronRight, Clock, X, Calendar, CheckCircle, Users, Target, Heart, AlertTriangle, Sparkles, ArrowRight, Battery, BatteryLow, Zap, Briefcase, Dumbbell, Coffee } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useState, useMemo } from 'react';
import logoImage from '../../assets/logo.jpg';
import { useAppContext } from '../App';

interface CalendarScreenProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

type CalendarModalType = 'event-detail' | 'total-events' | 'scheduled-time' | 'completion' | 'ai-suggestion' | null;
type ViewType = 'month' | 'week' | 'day';
type ActivityType = 'work' | 'exercise' | 'social' | 'rest';

interface EventType {
  time: string;
  title: string;
  type: ActivityType;
  energy?: number;
  energyImpact?: 'draining' | 'neutral' | 'energizing';
  description?: string;
  duration?: string;
  date?: Date;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Activity type configuration with colors and icons
const activityConfig = {
  work: {
    icon: Briefcase,
    label: 'Work',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    lightBorder: 'border-blue-200',
    darkBg: 'bg-blue-900/30',
    darkText: 'text-blue-300',
    darkBorder: 'border-blue-800',
    dotColor: 'bg-blue-500',
  },
  exercise: {
    icon: Dumbbell,
    label: 'Exercise',
    lightBg: 'bg-green-50',
    lightText: 'text-green-700',
    lightBorder: 'border-green-200',
    darkBg: 'bg-green-900/30',
    darkText: 'text-green-300',
    darkBorder: 'border-green-800',
    dotColor: 'bg-green-500',
  },
  social: {
    icon: Users,
    label: 'Social',
    lightBg: 'bg-purple-50',
    lightText: 'text-purple-700',
    lightBorder: 'border-purple-200',
    darkBg: 'bg-purple-900/30',
    darkText: 'text-purple-300',
    darkBorder: 'border-purple-800',
    dotColor: 'bg-purple-500',
  },
  rest: {
    icon: Coffee,
    label: 'Rest',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-700',
    lightBorder: 'border-amber-200',
    darkBg: 'bg-amber-900/30',
    darkText: 'text-amber-300',
    darkBorder: 'border-amber-800',
    dotColor: 'bg-amber-500',
  },
};

export function CalendarScreen({ currentTab, onTabChange }: CalendarScreenProps) {
  const { darkMode, openQuickReflection } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 5)); // Jan 5, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 5));
  const [activeModal, setActiveModal] = useState<CalendarModalType>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [viewType, setViewType] = useState<ViewType>('month');

  // Dark mode colors
  const bgColor = darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f1ed]';
  const cardBg = darkMode ? 'bg-[#2a2a2a]' : 'bg-white/90';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-[#2a2520]';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-[#8b7355]';
  const switcherBg = darkMode ? 'bg-[#333]' : 'bg-white/80';

  // Get current month/year for display
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear]);

  // Sample events with dates
  const allEvents: EventType[] = useMemo(() => [
    { time: '09:00 AM', title: 'Team Standup', type: 'work', energyImpact: 'neutral', description: 'Weekly team standup to discuss progress.', duration: '30 min', date: new Date(2026, 0, 5) },
    { time: '11:30 AM', title: 'Client Call', type: 'work', energyImpact: 'draining', description: 'Quarterly review with client.', duration: '1 hour', date: new Date(2026, 0, 5) },
    { time: '02:00 PM', title: 'Gym Session', type: 'exercise', energyImpact: 'energizing', description: 'Strength training workout.', duration: '1 hour', date: new Date(2026, 0, 5) },
    { time: '06:00 PM', title: 'Dinner with Friends', type: 'social', energyImpact: 'energizing', description: 'Catching up at the new restaurant.', duration: '2 hours', date: new Date(2026, 0, 5) },
    { time: '09:00 PM', title: 'Reading Time', type: 'rest', energyImpact: 'neutral', description: 'Wind down with a good book.', duration: '1 hour', date: new Date(2026, 0, 5) },
    // More events for other days
    { time: '10:00 AM', title: '1:1 with Manager', type: 'work', energyImpact: 'neutral', duration: '30 min', date: new Date(2026, 0, 6) },
    { time: '07:00 AM', title: 'Morning Run', type: 'exercise', energyImpact: 'energizing', duration: '45 min', date: new Date(2026, 0, 6) },
    { time: '03:00 PM', title: 'Project Review', type: 'work', energyImpact: 'draining', duration: '2 hours', date: new Date(2026, 0, 7) },
    { time: '12:00 PM', title: 'Team Lunch', type: 'social', energyImpact: 'energizing', duration: '1 hour', date: new Date(2026, 0, 7) },
    { time: '05:00 PM', title: 'Yoga Class', type: 'exercise', energyImpact: 'energizing', duration: '1 hour', date: new Date(2026, 0, 8) },
    { time: '11:00 AM', title: 'All Hands Meeting', type: 'work', energyImpact: 'neutral', duration: '1 hour', date: new Date(2026, 0, 8) },
    { time: '02:00 PM', title: 'Coffee Chat', type: 'social', energyImpact: 'energizing', duration: '30 min', date: new Date(2026, 0, 9) },
    { time: '10:00 AM', title: 'Focus Time', type: 'work', energyImpact: 'neutral', duration: '3 hours', date: new Date(2026, 0, 9) },
    { time: '09:00 AM', title: 'Weekend Hike', type: 'exercise', energyImpact: 'energizing', duration: '3 hours', date: new Date(2026, 0, 10) },
    { time: '04:00 PM', title: 'Spa Day', type: 'rest', energyImpact: 'energizing', duration: '2 hours', date: new Date(2026, 0, 11) },
    { time: '06:00 PM', title: 'Family Dinner', type: 'social', energyImpact: 'energizing', duration: '2 hours', date: new Date(2026, 0, 11) },
  ], []);

  // Get events for selected date
  const eventsForSelectedDate = useMemo(() => {
    return allEvents.filter(e =>
      e.date &&
      e.date.getDate() === selectedDate.getDate() &&
      e.date.getMonth() === selectedDate.getMonth() &&
      e.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [allEvents, selectedDate]);

  // Get week data for week view
  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Go to Sunday

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const events = allEvents.filter(e =>
        e.date &&
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth()
      );
      return {
        day: daysOfWeek[i],
        date: date.getDate(),
        fullDate: date,
        events,
      };
    });
  }, [currentDate, allEvents]);

  // AI Suggestions
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: '1',
      originalEvent: 'Client Call',
      originalTime: '11:30 AM',
      suggestedTime: '09:00 AM',
      reason: 'Your energy typically dips after 11am. Moving this to early morning could improve focus.',
      energyGain: 25,
    }
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<typeof aiSuggestions[0] | null>(null);
  const [toast, setToast] = useState<{message: string, show: boolean}>({message: '', show: false});

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  };

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
    if (viewType === 'day') {
      setSelectedDate(newDate);
    }
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    if (viewType === 'day') {
      setSelectedDate(newDate);
    }
  };

  const getDateDisplay = () => {
    if (viewType === 'month') {
      return `${months[currentMonth]} ${currentYear}`;
    } else if (viewType === 'week') {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${months[startOfWeek.getMonth()].slice(0, 3)} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${currentYear}`;
      } else {
        return `${months[startOfWeek.getMonth()].slice(0, 3)} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()].slice(0, 3)} ${endOfWeek.getDate()}`;
      }
    } else {
      return `${months[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    }
  };

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    setActiveModal('event-detail');
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    setActiveModal(null);
    setSelectedSuggestion(null);
    showToast('Schedule updated!');
  };

  const handleDeclineSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    setActiveModal(null);
    setSelectedSuggestion(null);
  };

  const getActivityColors = (type: ActivityType) => {
    const config = activityConfig[type];
    return darkMode
      ? `${config.darkBg} ${config.darkText} ${config.darkBorder}`
      : `${config.lightBg} ${config.lightText} ${config.lightBorder}`;
  };

  const getActivityIcon = (type: ActivityType) => {
    const IconComponent = activityConfig[type].icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getDotColor = (type: ActivityType) => {
    return activityConfig[type].dotColor;
  };

  // Check if a day has events
  const dayHasEvents = (day: number) => {
    return allEvents.some(e =>
      e.date &&
      e.date.getDate() === day &&
      e.date.getMonth() === currentMonth &&
      e.date.getFullYear() === currentYear
    );
  };

  // Get unique activity types for a day (for colored dots)
  const getDayActivityTypes = (day: number): ActivityType[] => {
    const events = allEvents.filter(e =>
      e.date &&
      e.date.getDate() === day &&
      e.date.getMonth() === currentMonth
    );
    return [...new Set(events.map(e => e.type))];
  };

  // Time slots for day view
  const timeSlots = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'];

  const renderModalContent = () => {
    switch (activeModal) {
      case 'event-detail':
        if (!selectedEvent) return null;
        const config = activityConfig[selectedEvent.type];
        return (
          <div>
            <div className={`w-14 h-14 ${getActivityColors(selectedEvent.type)} border rounded-full flex items-center justify-center mx-auto mb-4`}>
              {getActivityIcon(selectedEvent.type)}
            </div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'} text-center mb-2`}>{selectedEvent.title}</h3>
            <div className="flex justify-center gap-2 mb-4">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedEvent.time}</span>
              {selectedEvent.duration && (
                <>
                  <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedEvent.duration}</span>
                </>
              )}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 mb-4 ${getActivityColors(selectedEvent.type)} border`}>
              {getActivityIcon(selectedEvent.type)}
              {config.label}
            </div>
            {selectedEvent.description && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-[#f5f1ed]'} rounded-xl p-4 mb-4`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedEvent.description}</p>
              </div>
            )}
            {selectedEvent.energyImpact && (
              <div className={`rounded-xl p-4 mb-4 border ${
                selectedEvent.energyImpact === 'draining'
                  ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                  : selectedEvent.energyImpact === 'energizing'
                  ? darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                  : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  {selectedEvent.energyImpact === 'draining' && <BatteryLow className="w-4 h-4 text-red-500" />}
                  {selectedEvent.energyImpact === 'energizing' && <Zap className="w-4 h-4 text-green-500" />}
                  {selectedEvent.energyImpact === 'neutral' && <Battery className="w-4 h-4 text-gray-500" />}
                  <span className={`text-sm font-medium capitalize ${
                    selectedEvent.energyImpact === 'draining' ? 'text-red-600' :
                    selectedEvent.energyImpact === 'energizing' ? 'text-green-600' :
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedEvent.energyImpact} on energy
                  </span>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button className={`flex-1 py-3 rounded-full text-sm transition-colors ${
                darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-[#f5f1ed] text-[#2a2520] hover:bg-[#ebe5df]'
              }`}>
                Edit
              </button>
              <button className={`flex-1 py-3 rounded-full text-sm transition-colors ${
                darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}>
                Delete
              </button>
            </div>
          </div>
        );
      case 'ai-suggestion':
        if (!selectedSuggestion) return null;
        return (
          <div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-amber-900/30' : 'bg-gradient-to-br from-amber-100 to-orange-100'
            }`}>
              <Sparkles className={`w-7 h-7 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'} text-center mb-2`}>AI Schedule Suggestion</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>Optimize your energy</p>

            <div className={`rounded-xl p-4 mb-3 border ${
              darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <BatteryLow className="w-4 h-4 text-red-500" />
                <span className={`text-xs font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>ENERGY DRAIN RISK</span>
              </div>
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>{selectedSuggestion.originalEvent}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Currently at {selectedSuggestion.originalTime}</div>
            </div>

            <div className="flex justify-center my-2">
              <ArrowRight className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-400'} rotate-90`} />
            </div>

            <div className={`rounded-xl p-4 mb-4 border ${
              darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>SUGGESTED TIME</span>
              </div>
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>{selectedSuggestion.originalEvent}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Move to {selectedSuggestion.suggestedTime}</div>
            </div>

            <div className={`rounded-xl p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-[#f5f1ed]'}`}>
              <div className="flex items-start gap-2">
                <span className="text-amber-500">💡</span>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedSuggestion.reason}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Battery className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">+{selectedSuggestion.energyGain}% predicted energy</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleDeclineSuggestion(selectedSuggestion.id)}
                className={`flex-1 py-3 rounded-full text-sm transition-colors ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dismiss
              </button>
              <button
                onClick={() => handleAcceptSuggestion(selectedSuggestion.id)}
                className="flex-1 bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-full ${bgColor} flex flex-col relative transition-colors duration-300`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-lg text-sm flex items-center gap-2 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-[#2a2520] text-white'
          }`}>
            <CheckCircle className="w-4 h-4" />
            {toast.message}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl relative`}>
            <button
              onClick={() => { setActiveModal(null); setSelectedEvent(null); setSelectedSuggestion(null); }}
              className={`absolute top-4 right-4 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X className="w-6 h-6" />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}

      {/* Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-28">
        {/* Header */}
        <div className="mb-4">
          <img
            src={logoImage}
            alt="noema"
            className={`h-28 mb-3 object-contain ${darkMode ? 'brightness-150 contrast-125' : ''}`}
          />
          <h1 className={`text-2xl ${textPrimary} mb-1`}>Calendar</h1>
          <div className={`text-xs ${textSecondary}`}>Plan your time & energy</div>
        </div>

        {/* AI Suggestions Banner */}
        {aiSuggestions.length > 0 && (
          <button
            onClick={() => {
              setSelectedSuggestion(aiSuggestions[0]);
              setActiveModal('ai-suggestion');
            }}
            className={`w-full rounded-2xl p-4 mb-4 border transition-all hover:shadow-md ${
              darkMode
                ? 'bg-gradient-to-r from-red-900/30 via-orange-900/30 to-amber-900/30 border-red-800'
                : 'bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>
                  Energy Optimization Available
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {aiSuggestions.length} suggestion{aiSuggestions.length > 1 ? 's' : ''} to improve your day
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                View
              </div>
            </div>
          </button>
        )}

        {/* View Switcher */}
        <div className={`flex ${switcherBg} rounded-full p-1 mb-4 shadow-sm`}>
          {(['month', 'week', 'day'] as ViewType[]).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-medium transition-all capitalize ${
                viewType === type
                  ? 'bg-[#a58872] text-white shadow-sm'
                  : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigatePrevious}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}
          >
            <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <h2 className={`text-lg ${textPrimary}`}>{getDateDisplay()}</h2>
          <button
            onClick={navigateNext}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}
          >
            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Activity Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(activityConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
              <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{config.label}</span>
            </div>
          ))}
        </div>

        {/* Month View */}
        {viewType === 'month' && (
          <>
            <div className={`${cardBg} rounded-2xl p-4 mb-6 shadow-md`}>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className={`text-center text-[10px] font-medium ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const activityTypes = day ? getDayActivityTypes(day) : [];
                  const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth();

                  return (
                    <div key={index} className="aspect-square flex items-center justify-center">
                      {day && (
                        <button
                          onClick={() => {
                            const newDate = new Date(currentYear, currentMonth, day);
                            setSelectedDate(newDate);
                          }}
                          className={`w-full h-full rounded-lg flex flex-col items-center justify-center text-xs relative transition-all ${
                            isSelected
                              ? 'bg-[#a58872] text-white shadow-sm'
                              : darkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-white/40 text-[#2a2520]'
                          }`}
                        >
                          {day}
                          {activityTypes.length > 0 && (
                            <div className="absolute bottom-1 flex gap-0.5">
                              {activityTypes.slice(0, 3).map((type, i) => (
                                <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : getDotColor(type)}`} />
                              ))}
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Events for selected day */}
            <section className="mb-6">
              <h2 className={`text-base ${textSecondary} mb-3`}>
                {months[selectedDate.getMonth()].slice(0, 3)} {selectedDate.getDate()} Schedule
              </h2>
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-2">
                  {eventsForSelectedDate.map((event, index) => (
                    <button
                      key={index}
                      onClick={() => handleEventClick(event)}
                      className={`w-full rounded-2xl p-3 transition-colors shadow-sm border ${getActivityColors(event.type)} ${
                        event.energyImpact === 'draining'
                          ? darkMode ? 'ring-2 ring-red-500/50' : 'ring-2 ring-red-300'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 rounded-full ${
                          event.energyImpact === 'draining' ? 'bg-red-500' :
                          event.energyImpact === 'energizing' ? 'bg-green-500' :
                          getDotColor(event.type)
                        }`} />
                        <div className="flex-1 text-left">
                          <div className={`text-xs opacity-70`}>{event.time}</div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            {event.title}
                            {event.energyImpact === 'draining' && (
                              <BatteryLow className="w-3 h-3 text-red-500" />
                            )}
                            {event.energyImpact === 'energizing' && (
                              <Zap className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                        </div>
                        {getActivityIcon(event.type)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`${cardBg} rounded-2xl p-6 text-center`}>
                  <Calendar className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No events scheduled</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Week View */}
        {viewType === 'week' && (
          <div className={`${cardBg} rounded-2xl p-4 mb-6 shadow-md`}>
            <div className="space-y-3">
              {weekData.map((day, idx) => {
                const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={idx}
                    className={`w-full rounded-xl p-3 transition-colors text-left ${
                      isSelected
                        ? darkMode ? 'bg-[#3d3020]' : 'bg-[#f5e6d3]'
                        : darkMode ? 'bg-[#333] hover:bg-[#3a3a3a]' : 'bg-[#f5f1ed] hover:bg-[#ebe5df]'
                    }`}
                    onClick={() => {
                      setSelectedDate(day.fullDate);
                      setCurrentDate(day.fullDate);
                      setViewType('day');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#a58872] text-white'
                          : darkMode ? 'bg-[#444] text-gray-200' : 'bg-white text-[#2a2520]'
                      }`}>
                        <div className="text-center">
                          <div className="text-[10px] leading-none">{day.day}</div>
                          <div className="text-sm font-medium">{day.date}</div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        {day.events.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {day.events.slice(0, 3).map((event, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-1 rounded-full border truncate ${getActivityColors(event.type)}`}
                              >
                                {event.title}
                              </span>
                            ))}
                            {day.events.length > 3 && (
                              <span className={`text-xs px-2 py-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                +{day.events.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No events</span>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Day View */}
        {viewType === 'day' && (
          <div className={`${cardBg} rounded-2xl p-4 mb-6 shadow-md`}>
            <div className="space-y-0">
              {timeSlots.map((time, idx) => {
                const eventAtTime = eventsForSelectedDate.find(e => {
                  const eventHour = parseInt(e.time.split(':')[0]);
                  const eventIsPM = e.time.includes('PM');
                  const slotHour = parseInt(time.split(' ')[0]);
                  const slotIsPM = time.includes('PM');
                  const eventHour24 = eventIsPM && eventHour !== 12 ? eventHour + 12 : (!eventIsPM && eventHour === 12 ? 0 : eventHour);
                  const slotHour24 = slotIsPM && slotHour !== 12 ? slotHour + 12 : (!slotIsPM && slotHour === 12 ? 0 : slotHour);
                  return eventHour24 === slotHour24;
                });

                return (
                  <div key={idx} className="flex items-stretch min-h-[50px]">
                    <div className={`w-14 text-[10px] pt-2 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {time}
                    </div>
                    <div className={`flex-1 border-t relative ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      {eventAtTime && (
                        <button
                          onClick={() => handleEventClick(eventAtTime)}
                          className={`absolute top-1 left-0 right-2 p-2 rounded-lg border text-left ${getActivityColors(eventAtTime.type)}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-medium">{eventAtTime.title}</div>
                              <div className="text-[10px] opacity-75">{eventAtTime.duration}</div>
                            </div>
                            {eventAtTime.energyImpact === 'draining' && <BatteryLow className="w-3 h-3 text-red-500" />}
                            {eventAtTime.energyImpact === 'energizing' && <Zap className="w-3 h-3 text-green-500" />}
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={onTabChange} onPlusClick={openQuickReflection} />
    </div>
  );
}
