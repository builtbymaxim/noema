import { User, Bell, Moon, ChevronRight, LogOut, X, Camera, Flame, Calendar, MapPin, Sun, HelpCircle, Trophy, Target, Zap, Star, Award, TrendingUp, Lock, Dumbbell, Users, Coffee, Clock } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useState } from 'react';
import logoImage from '../../assets/logo.jpg';
import { useAppContext } from '../App';

interface ProfileScreenProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

type ProfileModalType =
  | 'edit-photo'
  | 'all-reflections'
  | 'streak'
  | 'avg-energy'
  | 'edit-goals'
  | 'daily-reflections'
  | 'high-energy'
  | 'focus-hours'
  | 'peak-performance'
  | 'quiet-hours'
  | 'export-data'
  | 'app-settings'
  | 'logout'
  | 'calendar-sync'
  | 'location-settings'
  | 'notification-settings'
  | 'achievements'
  | 'goals'
  | null;

// Goal definitions
interface Goal {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
}

// Achievement definitions
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  progress: number; // 0-100
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export function ProfileScreen({ currentTab, onTabChange }: ProfileScreenProps) {
  const { darkMode, setDarkMode, connectedCalendars, setConnectedCalendars, settings, setSettings, streak, openQuickReflection, handleLogout } = useAppContext();
  const [toast, setToast] = useState<{message: string, show: boolean}>({message: '', show: false});
  const [activeModal, setActiveModal] = useState<ProfileModalType>(null);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [connectingCalendar, setConnectingCalendar] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['exercise', 'focus']);

  // Reminder scheduling
  const [reminderTimes, setReminderTimes] = useState<{id: string, time: string, label: string, enabled: boolean}[]>([
    { id: 'morning', time: '09:00', label: 'Morning check-in', enabled: true },
    { id: 'afternoon', time: '14:00', label: 'Afternoon break', enabled: false },
    { id: 'evening', time: '18:00', label: 'Evening reflection', enabled: true },
  ]);

  // Simple goals
  const availableGoals: Goal[] = [
    { id: 'exercise', label: 'Exercise more', icon: Dumbbell, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Stay active and energized' },
    { id: 'social', label: 'Socialize more', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100', description: 'Connect with friends & family' },
    { id: 'focus', label: 'Focus better', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Improve concentration' },
    { id: 'rest', label: 'Rest more', icon: Coffee, color: 'text-amber-600', bgColor: 'bg-amber-100', description: 'Take breaks and recharge' },
    { id: 'balance', label: 'Better balance', icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-100', description: 'Work-life harmony' },
    { id: 'morning', label: 'Morning person', icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-100', description: 'Start days earlier' },
  ];

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, 2000);
  };

  const handleConnectCalendar = (type: 'google' | 'icloud' | 'outlook') => {
    setConnectingCalendar(type);
    // Simulate OAuth flow
    setTimeout(() => {
      const newCalendar = {
        id: Date.now().toString(),
        type,
        email: type === 'google' ? 'user@gmail.com' : type === 'icloud' ? 'user@icloud.com' : 'user@outlook.com',
        connected: true,
      };
      setConnectedCalendars([...connectedCalendars, newCalendar]);
      setConnectingCalendar(null);
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} Calendar connected!`);
    }, 1500);
  };

  const handleDisconnectCalendar = (id: string) => {
    setConnectedCalendars(connectedCalendars.filter(c => c.id !== id));
    showToast('Calendar disconnected');
  };

  const recentReflections = [
    { date: 'Jan 5, 2026', value: 4, energy: 'energized', title: 'Morning check-in' },
    { date: 'Jan 4, 2026', value: 3, energy: 'neutral', title: 'Daily review' },
    { date: 'Jan 3, 2026', value: 5, energy: 'energized', title: 'Weekly planning' },
    { date: 'Jan 2, 2026', value: 2, energy: 'drained', title: 'After meetings' },
    { date: 'Jan 1, 2026', value: 4, energy: 'neutral', title: 'New year reflection' },
  ];

  // Achievement badges
  const achievements: Achievement[] = [
    {
      id: 'first-reflection',
      title: 'First Step',
      description: 'Complete your first reflection',
      icon: Star,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      progress: 100,
      unlocked: true,
      unlockedAt: 'Jan 1, 2026',
      requirement: '1 reflection',
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day reflection streak',
      icon: Flame,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
      progress: 100,
      unlocked: true,
      unlockedAt: 'Jan 7, 2026',
      requirement: '7-day streak',
    },
    {
      id: 'reflection-master',
      title: 'Reflection Master',
      description: 'Complete 100 reflections',
      icon: Trophy,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-100',
      progress: 100,
      unlocked: true,
      unlockedAt: 'Jan 10, 2026',
      requirement: '100 reflections',
    },
    {
      id: 'energy-optimizer',
      title: 'Energy Optimizer',
      description: 'Maintain average energy above 7 for a week',
      icon: Zap,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100',
      progress: 85,
      unlocked: false,
      requirement: 'Avg energy 7+ for 7 days',
    },
    {
      id: 'consistent-tracker',
      title: 'Consistent Tracker',
      description: 'Reflect at the same time for 5 days',
      icon: Target,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100',
      progress: 60,
      unlocked: false,
      requirement: '5 days same time',
    },
    {
      id: 'month-streak',
      title: 'Month Champion',
      description: 'Maintain a 30-day reflection streak',
      icon: Award,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-100',
      progress: Math.round((streak / 30) * 100),
      unlocked: false,
      requirement: '30-day streak',
    },
    {
      id: 'trend-spotter',
      title: 'Trend Spotter',
      description: 'Discover 5 personal insights',
      icon: TrendingUp,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      progress: 40,
      unlocked: false,
      requirement: '5 insights discovered',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const bgColor = darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f1ed]';
  const cardBg = darkMode ? 'bg-[#2a2a2a]' : 'bg-white/90';
  const textColor = darkMode ? 'text-gray-100' : 'text-[#2a2520]';
  const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const sectionTitle = darkMode ? 'text-gray-300' : 'text-[#8b7355]';

  const renderModalContent = () => {
    switch (activeModal) {
      case 'calendar-sync':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Connect Calendars</h3>
            <p className="text-sm text-gray-600 mb-4">Sync your calendars to get smart scheduling suggestions based on your energy patterns.</p>

            <div className="space-y-3 mb-4">
              {/* Google Calendar */}
              {connectedCalendars.find(c => c.type === 'google') ? (
                <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2a2520]">Google Calendar</div>
                      <div className="text-xs text-green-600">Connected</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnectCalendar(connectedCalendars.find(c => c.type === 'google')!.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectCalendar('google')}
                  disabled={connectingCalendar === 'google'}
                  className="w-full bg-[#f5f1ed] rounded-xl p-4 flex items-center gap-3 hover:bg-[#ebe5df] transition-colors disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-[#2a2520]">Google Calendar</div>
                    <div className="text-xs text-gray-500">{connectingCalendar === 'google' ? 'Connecting...' : 'Tap to connect'}</div>
                  </div>
                </button>
              )}

              {/* iCloud Calendar */}
              {connectedCalendars.find(c => c.type === 'icloud') ? (
                <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2a2520]">iCloud Calendar</div>
                      <div className="text-xs text-green-600">Connected</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnectCalendar(connectedCalendars.find(c => c.type === 'icloud')!.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectCalendar('icloud')}
                  disabled={connectingCalendar === 'icloud'}
                  className="w-full bg-[#f5f1ed] rounded-xl p-4 flex items-center gap-3 hover:bg-[#ebe5df] transition-colors disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-[#2a2520]">iCloud Calendar</div>
                    <div className="text-xs text-gray-500">{connectingCalendar === 'icloud' ? 'Connecting...' : 'Tap to connect'}</div>
                  </div>
                </button>
              )}

              {/* Outlook Calendar */}
              {connectedCalendars.find(c => c.type === 'outlook') ? (
                <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2a2520]">Outlook Calendar</div>
                      <div className="text-xs text-green-600">Connected</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnectCalendar(connectedCalendars.find(c => c.type === 'outlook')!.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectCalendar('outlook')}
                  disabled={connectingCalendar === 'outlook'}
                  className="w-full bg-[#f5f1ed] rounded-xl p-4 flex items-center gap-3 hover:bg-[#ebe5df] transition-colors disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-[#0078d4] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-[#2a2520]">Outlook Calendar</div>
                    <div className="text-xs text-gray-500">{connectingCalendar === 'outlook' ? 'Connecting...' : 'Tap to connect'}</div>
                  </div>
                </button>
              )}
            </div>

            {connectedCalendars.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <span>✓</span>
                  <span>{connectedCalendars.length} calendar{connectedCalendars.length > 1 ? 's' : ''} synced</span>
                </div>
                <p className="text-xs text-green-600 mt-1">You'll receive smart scheduling suggestions based on your energy patterns.</p>
              </div>
            )}
          </div>
        );
      case 'location-settings':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Location Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Help us understand your patterns by setting your common locations.</p>

            <div className="space-y-4">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-[#2a2520]">Auto-detect location</span>
                  </div>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      locations: { ...settings.locations, detectAutomatically: !settings.locations.detectAutomatically }
                    })}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.locations.detectAutomatically ? 'bg-[#a58872]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.locations.detectAutomatically ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Automatically detect when you're at work, home, or commuting.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#2a2520] mb-2 block">Home Address</label>
                <input
                  type="text"
                  placeholder="Enter your home address"
                  value={settings.locations.home}
                  onChange={(e) => setSettings({
                    ...settings,
                    locations: { ...settings.locations, home: e.target.value }
                  })}
                  className="w-full bg-[#f5f1ed] border-0 rounded-xl px-4 py-3 text-sm placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2a2520] mb-2 block">Work Address</label>
                <input
                  type="text"
                  placeholder="Enter your work address"
                  value={settings.locations.work}
                  onChange={(e) => setSettings({
                    ...settings,
                    locations: { ...settings.locations, work: e.target.value }
                  })}
                  className="w-full bg-[#f5f1ed] border-0 rounded-xl px-4 py-3 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600">💡</span>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Why we need this</p>
                    <p className="text-xs text-amber-700 mt-1">Location data helps us understand commute stress, work vs. home energy patterns, and suggest optimal times for tasks.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { showToast('Location settings saved'); setActiveModal(null); }}
              className="w-full mt-4 bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
            >
              Save
            </button>
          </div>
        );
      case 'notification-settings':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Notification Settings</h3>

            <div className="space-y-3 mb-4">
              <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#2a2520]">Mood Check-ins</div>
                  <div className="text-xs text-gray-500">Reminders to log your mood</div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, moodCheckIns: !settings.notifications.moodCheckIns }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.moodCheckIns ? 'bg-[#a58872]' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.notifications.moodCheckIns ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#2a2520]">Weekly Digest</div>
                  <div className="text-xs text-gray-500">Summary of your weekly patterns</div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, weeklyDigest: !settings.notifications.weeklyDigest }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.weeklyDigest ? 'bg-[#a58872]' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="bg-[#f5f1ed] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#2a2520]">Smart Reminders</div>
                  <div className="text-xs text-gray-500">AI-powered scheduling tips</div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, smartReminders: !settings.notifications.smartReminders }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.notifications.smartReminders ? 'bg-[#a58872]' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.notifications.smartReminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Scheduled Reminders */}
            {settings.notifications.moodCheckIns && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[#a58872]" />
                  <h4 className="text-sm font-medium text-[#2a2520]">Scheduled Check-ins</h4>
                </div>
                <div className="space-y-2">
                  {reminderTimes.map((reminder) => (
                    <div key={reminder.id} className="bg-[#f5f1ed] rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={reminder.time}
                          onChange={(e) => {
                            setReminderTimes(prev => prev.map(r =>
                              r.id === reminder.id ? { ...r, time: e.target.value } : r
                            ));
                          }}
                          className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-[#2a2520]"
                        />
                        <div>
                          <div className="text-sm text-[#2a2520]">{reminder.label}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setReminderTimes(prev => prev.map(r =>
                            r.id === reminder.id ? { ...r, enabled: !r.enabled } : r
                          ));
                        }}
                        className={`w-10 h-5 rounded-full transition-colors ${reminder.enabled ? 'bg-[#a58872]' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${reminder.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const newId = `custom-${Date.now()}`;
                    setReminderTimes(prev => [...prev, {
                      id: newId,
                      time: '12:00',
                      label: 'Custom reminder',
                      enabled: true,
                    }]);
                  }}
                  className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#a58872] hover:text-[#a58872] transition-colors"
                >
                  + Add reminder time
                </button>
              </div>
            )}

            <button
              onClick={() => { showToast('Notification settings saved'); setActiveModal(null); }}
              className="w-full bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
            >
              Save
            </button>
          </div>
        );
      case 'streak':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4 text-center">Week Streak</h3>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="w-10 h-10 text-amber-600" />
              </div>
              <div className="text-4xl font-light text-[#a58872]">{streak}</div>
              <div className="text-sm text-gray-500">Days in a row!</div>
            </div>
            <div className="bg-[#f5f1ed] rounded-xl p-4 mb-4">
              <h4 className="font-medium text-[#2a2520] mb-2">Streak History</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current streak</span>
                  <span className="font-medium">{streak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Longest streak</span>
                  <span className="font-medium">24 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total reflections</span>
                  <span className="font-medium">127</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">Keep reflecting daily to grow your streak!</p>
          </div>
        );
      case 'edit-photo':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4 text-center">Edit Profile Photo</h3>
            <div className="w-24 h-24 bg-gradient-to-br from-[#a58872] to-[#6b5344] rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-3">
              <button className="w-full bg-[#f5f1ed] text-[#2a2520] py-3 rounded-full text-sm hover:bg-[#ebe5df] transition-colors flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
              <button className="w-full bg-[#f5f1ed] text-[#2a2520] py-3 rounded-full text-sm hover:bg-[#ebe5df] transition-colors">
                Choose from Library
              </button>
              <button className="w-full bg-red-50 text-red-600 py-3 rounded-full text-sm hover:bg-red-100 transition-colors">
                Remove Photo
              </button>
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-2">Log Out?</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-[#f5f1ed] text-[#2a2520] py-3 rounded-full text-sm hover:bg-[#ebe5df] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  handleLogout();
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-full text-sm hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        );
      case 'goals':
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-[#2a2520]">Your Goals</h3>
              <p className="text-sm text-gray-500">What do you want to focus on?</p>
            </div>

            <div className="space-y-2 mb-4">
              {availableGoals.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedGoals(prev => prev.filter(g => g !== goal.id));
                      } else {
                        setSelectedGoals(prev => [...prev, goal.id]);
                      }
                    }}
                    className={`w-full rounded-xl p-4 flex items-center gap-3 transition-all border-2 ${
                      isSelected
                        ? `${goal.bgColor} border-current ${goal.color}`
                        : 'bg-[#f5f1ed] border-transparent hover:bg-[#ebe5df]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/50' : goal.bgColor}`}>
                      <IconComponent className={`w-5 h-5 ${goal.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${isSelected ? goal.color : 'text-[#2a2520]'}`}>
                        {goal.label}
                      </div>
                      <div className="text-xs text-gray-500">{goal.description}</div>
                    </div>
                    {isSelected && (
                      <div className={`w-6 h-6 rounded-full ${goal.bgColor} flex items-center justify-center`}>
                        <span className={`text-sm ${goal.color}`}>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p className={`text-xs text-center text-gray-500 mb-4`}>
              Select up to 3 goals. We'll help you track progress and send relevant insights.
            </p>

            <button
              onClick={() => { showToast('Goals saved!'); setActiveModal(null); }}
              className="w-full bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
            >
              Save Goals
            </button>
          </div>
        );
      case 'achievements':
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-[#2a2520]">Achievements</h3>
              <p className="text-sm text-gray-500">{unlockedCount} of {achievements.length} unlocked</p>
            </div>

            <div className="space-y-3">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-4 border transition-all ${
                      achievement.unlocked
                        ? 'bg-[#f5f1ed] border-transparent'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? achievement.bgColor : 'bg-gray-200'
                      }`}>
                        {achievement.unlocked ? (
                          <IconComponent className={`w-6 h-6 ${achievement.iconColor}`} />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${achievement.unlocked ? 'text-[#2a2520]' : 'text-gray-500'}`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>{achievement.requirement}</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#a58872] rounded-full transition-all"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="text-[10px] text-green-600 mt-1">Unlocked {achievement.unlockedAt}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-[#2a2520] text-white px-6 py-3 rounded-full shadow-lg text-sm">
            {toast.message}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 z-50"
            >
              <X className="w-6 h-6" />
            </button>
            {renderModalContent()}
            {activeModal !== 'logout' && activeModal !== 'calendar-sync' && activeModal !== 'location-settings' && activeModal !== 'notification-settings' && (
              <button
                onClick={() => setActiveModal(null)}
                className="w-full mt-4 bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-28">
        {/* Header */}
        <div className="mb-6">
          <img
            src={logoImage}
            alt="noema"
            className={`h-28 mb-3 object-contain ${darkMode ? 'brightness-150 contrast-125' : ''}`}
          />
          <h1 className={`text-2xl ${textColor} mb-1`}>Profile</h1>
          <div className={`text-xs ${sectionTitle}`}>Your time & energy insights</div>
        </div>

        {/* Profile Card */}
        <div className={`${cardBg} rounded-2xl p-6 mb-6 text-center shadow-md transition-colors duration-300`}>
          <button
            onClick={() => setActiveModal('edit-photo')}
            className="w-20 h-20 bg-gradient-to-br from-[#a58872] to-[#6b5344] rounded-full mx-auto mb-4 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <User className="w-10 h-10 text-white" />
          </button>
          <h2 className={`text-xl ${textColor} mb-1`}>Max Mustermann</h2>
          <p className={`text-xs ${subTextColor} mb-4`}>Member since Jan 2025</p>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <button className="hover:opacity-70 rounded-lg p-2 transition-opacity">
              <div className={`text-2xl ${textColor} mb-1`}>127</div>
              <div className={`text-[10px] ${subTextColor}`}>Reflections</div>
            </button>
            <button
              onClick={() => setActiveModal('streak')}
              className="hover:opacity-70 rounded-lg p-2 transition-opacity"
            >
              <div className={`text-2xl ${textColor} mb-1 flex items-center justify-center gap-1`}>
                {streak}
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className={`text-[10px] ${subTextColor}`}>Day Streak</div>
            </button>
            <button className="hover:opacity-70 rounded-lg p-2 transition-opacity">
              <div className={`text-2xl ${textColor} mb-1`}>7.5</div>
              <div className={`text-[10px] ${subTextColor}`}>Avg Energy</div>
            </button>
          </div>
        </div>

        {/* Goals */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base ${sectionTitle}`}>Your Goals</h2>
            <button
              onClick={() => setActiveModal('goals')}
              className={`text-xs ${darkMode ? 'text-blue-400' : 'text-[#a58872]'}`}
            >
              Edit
            </button>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            {selectedGoals.length === 0 ? (
              <button
                onClick={() => setActiveModal('goals')}
                className={`w-full py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Target className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className="text-sm">Tap to set your goals</p>
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedGoals.map(goalId => {
                  const goal = availableGoals.find(g => g.id === goalId);
                  if (!goal) return null;
                  const IconComponent = goal.icon;
                  return (
                    <div
                      key={goal.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full ${goal.bgColor} ${goal.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs font-medium">{goal.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base ${sectionTitle}`}>Achievements</h2>
            <button
              onClick={() => setActiveModal('achievements')}
              className={`text-xs ${darkMode ? 'text-amber-400' : 'text-[#a58872]'}`}
            >
              View all
            </button>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            {/* Progress summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className={`text-sm ${textColor}`}>{unlockedCount}/{achievements.length} Unlocked</span>
              </div>
              <div className="flex -space-x-2">
                {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`w-8 h-8 rounded-full ${achievement.bgColor} flex items-center justify-center border-2 ${darkMode ? 'border-[#2a2a2a]' : 'border-white'}`}
                    >
                      <IconComponent className={`w-4 h-4 ${achievement.iconColor}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next achievement to unlock */}
            {(() => {
              const nextAchievement = achievements.find(a => !a.unlocked);
              if (!nextAchievement) return null;
              const IconComponent = nextAchievement.icon;
              return (
                <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-800' : 'bg-[#f5f1ed]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center`}>
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs ${subTextColor}`}>Next achievement</div>
                      <div className={`text-sm font-medium ${textColor}`}>{nextAchievement.title}</div>
                      <div className="mt-1.5">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#a58872] rounded-full transition-all"
                            style={{ width: `${nextAchievement.progress}%` }}
                          />
                        </div>
                        <div className={`text-[10px] ${subTextColor} mt-1`}>{nextAchievement.progress}% - {nextAchievement.requirement}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Connected Calendars */}
        <section className="mb-6">
          <h2 className={`text-base ${sectionTitle} mb-3`}>Connected Calendars</h2>
          <button
            onClick={() => setActiveModal('calendar-sync')}
            className={`w-full ${cardBg} rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-all shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className={`text-sm ${textColor}`}>
                  {connectedCalendars.length > 0
                    ? `${connectedCalendars.length} calendar${connectedCalendars.length > 1 ? 's' : ''} connected`
                    : 'Connect your calendars'
                  }
                </div>
                <div className={`text-xs ${subTextColor}`}>
                  {connectedCalendars.length > 0
                    ? 'Tap to manage'
                    : 'Google, iCloud, Outlook'
                  }
                </div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${subTextColor}`} />
          </button>
        </section>

        {/* Smart Features */}
        <section className="mb-6">
          <h2 className={`text-base ${sectionTitle} mb-3`}>Smart Features</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveModal('location-settings')}
              className={`w-full ${cardBg} rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-all shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="text-left">
                  <span className={`text-sm ${textColor}`}>Location Awareness</span>
                  <div className={`text-xs ${subTextColor}`}>
                    {settings.locations.detectAutomatically ? 'Auto-detect enabled' : 'Manual mode'}
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${subTextColor}`} />
            </button>

            <button
              onClick={() => setActiveModal('notification-settings')}
              className={`w-full ${cardBg} rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-all shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="text-left">
                  <span className={`text-sm ${textColor}`}>Notifications</span>
                  <div className={`text-xs ${subTextColor}`}>Mood check-ins, weekly digest</div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${subTextColor}`} />
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="mb-6">
          <h2 className={`text-base ${sectionTitle} mb-3`}>Appearance</h2>
          <div className={`${cardBg} rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-300`}>
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className={`text-sm ${textColor}`}>Dark Mode</span>
                <div className={`text-xs ${subTextColor}`}>{darkMode ? 'On' : 'Off'}</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </section>

        {/* Helpers */}
        <section className="mb-6">
          <h2 className={`text-base ${sectionTitle} mb-3`}>Helpers</h2>
          <div className={`${cardBg} rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-300`}>
            <div className="flex items-center gap-3">
              <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <div>
                <span className={`text-sm ${textColor}`}>Show Helpers</span>
                <div className={`text-xs ${subTextColor}`}>Tips and suggestions</div>
              </div>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                helpers: { ...settings.helpers, enabled: !settings.helpers.enabled }
              })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.helpers.enabled ? 'bg-[#a58872]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.helpers.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </section>

        {/* Account */}
        <section className="mb-6">
          <h2 className={`text-base ${sectionTitle} mb-3`}>Account</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveModal('logout')}
              className={`w-full ${cardBg} rounded-2xl p-4 flex items-center justify-between hover:bg-red-50 transition-colors shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">Log Out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Decorative sparkle */}
        <div className={`text-center text-xl ${darkMode ? 'text-gray-600' : 'text-gray-300'} mt-6 mb-4`}>✦</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={onTabChange} onPlusClick={openQuickReflection} />
    </div>
  );
}
