import { ChevronLeft, ChevronRight, X, TrendingUp, Zap, Clock, Calendar, Flame, Target, Activity, Sun } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BottomNav } from './BottomNav';
import { useState } from 'react';
import logoImage from '../../assets/logo.jpg';
import { useAppContext } from '../App';

type DetailModalType =
  | 'energy-trends'
  | 'focus-time'
  | 'all-insights'
  | 'long-range'
  | 'energy-driver'
  | 'best-time'
  | 'reflection-feb'
  | 'reflection-nov'
  | 'weekly-digest'
  | null;

interface WeeklyReflectionsScreenProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const energyData = [
  { day: 'Mon', value: 5 },
  { day: 'Tue', value: 7 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 7 },
];

const focusData = [
  { day: 'Mon', planned: 6, actual: 5 },
  { day: 'Tue', planned: 7, actual: 6 },
  { day: 'Wed', planned: 6, actual: 4 },
  { day: 'Thu', planned: 8, actual: 7 },
  { day: 'Fri', planned: 6, actual: 5 },
  { day: 'Sat', planned: 4, actual: 3 },
  { day: 'Sun', planned: 5, actual: 6 },
];

// Weekly digest summary data
const weeklyDigestData = {
  weekOf: 'Jan 5 - Jan 11, 2026',
  totalReflections: 14,
  avgEnergy: 7.2,
  energyChange: +12,
  topMood: 'energized',
  streakDays: 7,
  focusHours: 36,
  plannedHours: 42,
  topInsight: 'You performed 40% better before noon',
  peakDay: 'Saturday',
  lowDay: 'Wednesday',
  recommendations: [
    'Schedule creative work on Saturday mornings',
    'Add buffer time on Wednesdays',
    'Consider shorter meetings in the afternoon'
  ]
};

export function WeeklyReflectionsScreen({ currentTab, onTabChange }: WeeklyReflectionsScreenProps) {
  const { darkMode, openQuickReflection } = useAppContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeModal, setActiveModal] = useState<DetailModalType>(null);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{day: string, value: number, type: 'energy' | 'focus'} | null>(null);

  // Dark mode colors
  const bgColor = darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f1ed]';
  const cardBg = darkMode ? 'bg-[#2a2a2a]' : 'bg-white/90';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-[#2a2520]';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-[#8b7355]';

  const renderModalContent = () => {
    switch (activeModal) {
      case 'energy-trends':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Energy Trends Over Time</h3>
            <div className="space-y-4">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="day" stroke="#999" fontSize={10} />
                    <YAxis stroke="#999" fontSize={10} domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#a58872" strokeWidth={2} dot={{ fill: '#a58872', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f5f1ed] rounded-xl p-3 text-center">
                  <div className="text-2xl font-light text-[#2a2520]">7.2</div>
                  <div className="text-xs text-gray-500">Weekly Average</div>
                </div>
                <div className="bg-[#f5f1ed] rounded-xl p-3 text-center">
                  <div className="text-2xl font-light text-[#2a2520]">+12%</div>
                  <div className="text-xs text-gray-500">vs Last Week</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>Key Insight:</strong> Your energy peaks on Saturdays and dips mid-week on Wednesdays.</p>
                <p>Consider scheduling demanding tasks on high-energy days for better results.</p>
              </div>
            </div>
          </div>
        );
      case 'focus-time':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Focus Time Breakdown</h3>
            <div className="space-y-4">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={focusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="day" stroke="#999" fontSize={10} />
                    <YAxis stroke="#999" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="planned" fill="#d4c4b0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#8b7355" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#f5f1ed] rounded-xl p-3 text-center">
                  <div className="text-xl font-light text-[#2a2520]">42h</div>
                  <div className="text-[10px] text-gray-500">Planned</div>
                </div>
                <div className="bg-[#f5f1ed] rounded-xl p-3 text-center">
                  <div className="text-xl font-light text-[#2a2520]">36h</div>
                  <div className="text-[10px] text-gray-500">Actual</div>
                </div>
                <div className="bg-[#f5f1ed] rounded-xl p-3 text-center">
                  <div className="text-xl font-light text-amber-600">86%</div>
                  <div className="text-[10px] text-gray-500">Efficiency</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Tip:</strong> You tend to overestimate time on Wednesdays. Try planning 20% less for mid-week days.</p>
              </div>
            </div>
          </div>
        );
      case 'all-insights':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">All Insights & Patterns</h3>
            <div className="space-y-3">
              <button onClick={() => setActiveModal('long-range')} className="w-full bg-[#f5f1ed] rounded-xl p-4 text-left hover:bg-[#ebe5df] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-[#2a2520]">Long-Range Score: 7/10</div>
                    <div className="text-xs text-gray-500">Your focus on long-term goals</div>
                  </div>
                </div>
              </button>
              <button onClick={() => setActiveModal('energy-driver')} className="w-full bg-[#f5f1ed] rounded-xl p-4 text-left hover:bg-[#ebe5df] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-[#2a2520]">Top Energy Driver: Meetings</div>
                    <div className="text-xs text-gray-500">What gives you the most energy</div>
                  </div>
                </div>
              </button>
              <button onClick={() => setActiveModal('best-time')} className="w-full bg-[#f5f1ed] rounded-xl p-4 text-left hover:bg-[#ebe5df] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-[#2a2520]">Best Time: Morning</div>
                    <div className="text-xs text-gray-500">Your peak productivity hours</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      case 'long-range':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Long-Range Score</h3>
            <div className="text-center mb-6">
              <div className="text-5xl font-light text-[#a58872] mb-2">7/10</div>
              <div className="text-sm text-gray-500">Your ability to focus on long-term goals</div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <h4 className="font-medium text-[#2a2520] mb-2">What this means</h4>
                <p className="text-sm text-gray-600">You spend about 70% of your time on activities that align with your long-term objectives. This is above average!</p>
              </div>
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <h4 className="font-medium text-[#2a2520] mb-2">How to improve</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Block 2 hours daily for deep work</li>
                  <li>• Review weekly goals each Monday</li>
                  <li>• Say no to low-priority requests</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'energy-driver':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Top Energy Driver</h3>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-2xl font-medium text-[#2a2520]">Meetings</div>
              <div className="text-sm text-gray-500">Activities that energize you most</div>
            </div>
            <div className="space-y-3">
              <div className="bg-[#f5f1ed] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#2a2520]">Meetings</span>
                <span className="text-sm font-medium text-amber-600">+35% energy</span>
              </div>
              <div className="bg-[#f5f1ed] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#2a2520]">Creative Work</span>
                <span className="text-sm font-medium text-green-600">+28% energy</span>
              </div>
              <div className="bg-[#f5f1ed] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-[#2a2520]">Admin Tasks</span>
                <span className="text-sm font-medium text-red-600">-15% energy</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Consider scheduling more collaborative sessions when you need an energy boost.</p>
          </div>
        );
      case 'best-time':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Best Time for Focus</h3>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-medium text-[#2a2520]">Morning</div>
              <div className="text-sm text-gray-500">9:00 AM - 12:00 PM</div>
            </div>
            <div className="bg-[#f5f1ed] rounded-xl p-4 mb-4">
              <h4 className="font-medium text-[#2a2520] mb-2">Performance by Time</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">Morning</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-xs font-medium">90%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">Afternoon</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs font-medium">65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">Evening</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-300 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs font-medium">45%</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">You perform 40% better before noon. Schedule your most important tasks in the morning.</p>
          </div>
        );
      case 'reflection-feb':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Reflections - Feb 23, 2025</h3>
            <div className="space-y-3">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2a2520]">Morning Reflection</span>
                  <span className="text-xs text-gray-500">9:15 AM</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#e8f0e8] text-green-700 px-2 py-0.5 rounded-full text-xs">energized</span>
                  <span className="bg-[#f5e6d3] text-[#a58872] px-2 py-0.5 rounded-full text-xs">Value 8/10</span>
                </div>
                <p className="text-sm text-gray-600">Great start to the day. Finished project proposal ahead of schedule.</p>
              </div>
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2a2520]">Afternoon Check-in</span>
                  <span className="text-xs text-gray-500">2:30 PM</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#f5f0e0] text-amber-700 px-2 py-0.5 rounded-full text-xs">neutral</span>
                  <span className="bg-[#f5e6d3] text-[#a58872] px-2 py-0.5 rounded-full text-xs">Value 6/10</span>
                </div>
                <p className="text-sm text-gray-600">Post-lunch slump. Took a short walk which helped.</p>
              </div>
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2a2520]">Evening Review</span>
                  <span className="text-xs text-gray-500">6:00 PM</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#e8f0e8] text-green-700 px-2 py-0.5 rounded-full text-xs">energized</span>
                  <span className="bg-[#f5e6d3] text-[#a58872] px-2 py-0.5 rounded-full text-xs">Value 7/10</span>
                </div>
                <p className="text-sm text-gray-600">Productive day overall. Learning: Morning focus sessions work best for me.</p>
              </div>
            </div>
          </div>
        );
      case 'reflection-nov':
        return (
          <div>
            <h3 className="text-lg font-medium text-[#2a2520] mb-4">Reflections - Nov 29, 2023</h3>
            <div className="space-y-3">
              <div className="bg-[#f5f1ed] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2a2520]">Daily Reflection</span>
                  <span className="text-xs text-gray-500">7:45 PM</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#fce8e8] text-red-700 px-2 py-0.5 rounded-full text-xs">drained</span>
                  <span className="bg-[#f5e6d3] text-[#a58872] px-2 py-0.5 rounded-full text-xs">Value 4/10</span>
                </div>
                <p className="text-sm text-gray-600">Challenging day with back-to-back meetings. Need to protect focus time better.</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Learning:</span>
                  <p className="text-sm text-gray-600">Schedule buffer time between meetings to recharge.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'weekly-digest':
        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-medium text-[#2a2520]">Weekly Digest</h3>
              <p className="text-sm text-gray-500">{weeklyDigestData.weekOf}</p>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">Avg Energy</span>
                </div>
                <div className="text-2xl font-light text-[#2a2520]">{weeklyDigestData.avgEnergy}</div>
                <div className="text-xs text-green-600">+{weeklyDigestData.energyChange}% vs last week</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-gray-600">Streak</span>
                </div>
                <div className="text-2xl font-light text-[#2a2520]">{weeklyDigestData.streakDays} days</div>
                <div className="text-xs text-amber-600">Keep it going!</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Reflections</span>
                </div>
                <div className="text-2xl font-light text-[#2a2520]">{weeklyDigestData.totalReflections}</div>
                <div className="text-xs text-blue-600">This week</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-600">Focus Time</span>
                </div>
                <div className="text-2xl font-light text-[#2a2520]">{weeklyDigestData.focusHours}h</div>
                <div className="text-xs text-purple-600">{Math.round(weeklyDigestData.focusHours / weeklyDigestData.plannedHours * 100)}% of planned</div>
              </div>
            </div>

            {/* Energy Mini Chart */}
            <div className="bg-[#f5f1ed] rounded-xl p-4 mb-4">
              <div className="text-xs text-gray-600 mb-2">Energy This Week</div>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={energyData}>
                  <Area type="monotone" dataKey="value" stroke="#a58872" fill="#a58872" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Peak: {weeklyDigestData.peakDay}</span>
                <span>Low: {weeklyDigestData.lowDay}</span>
              </div>
            </div>

            {/* Top Insight */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4 border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Top Insight</div>
                  <div className="text-sm text-[#2a2520]">{weeklyDigestData.topInsight}</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#f5f1ed] rounded-xl p-4">
              <div className="text-xs text-gray-600 mb-3">Recommendations for Next Week</div>
              <div className="space-y-2">
                {weeklyDigestData.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-[#a58872]">{idx + 1}</span>
                    </div>
                    <span className="text-sm text-[#2a2520]">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-full ${bgColor} flex flex-col relative transition-colors duration-300`}>
      {/* Detail Modal */}
      {activeModal && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl`}>
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 z-50"
            >
              <X className="w-6 h-6" />
            </button>
            {renderModalContent()}
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-4 bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
            >
              Close
            </button>
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
          <h1 className={`text-2xl ${textPrimary} mb-2`}>Weekly Reflections</h1>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40'}`}
            >
              <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <div className={`text-xs ${textSecondary}`}>
              {weekOffset === 0 ? 'This week' : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago`}
            </div>
            <button
              onClick={() => weekOffset < 0 && setWeekOffset(weekOffset + 1)}
              className={`p-1 rounded-full transition-colors ${weekOffset < 0 ? (darkMode ? 'hover:bg-white/10' : 'hover:bg-white/40') : 'opacity-30'}`}
              disabled={weekOffset === 0}
            >
              <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Weekly Digest Banner */}
        <button
          onClick={() => setActiveModal('weekly-digest')}
          className={`w-full rounded-2xl p-4 mb-6 border hover:shadow-md transition-shadow ${
            darkMode
              ? 'bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-amber-900/30 border-amber-800'
              : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-900/50' : 'bg-gradient-to-br from-amber-100 to-orange-100'}`}>
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 text-left">
              <div className={`text-sm font-medium ${textPrimary}`}>Weekly Digest Ready</div>
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Tap to see your week in review</div>
            </div>
            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </button>

        {/* Personal Insights - PROMINENT SECTION */}
        <section className="mb-6">
          <h2 className={`text-base ${textSecondary} mb-3`}>Personal Insights</h2>
          <div className={`${cardBg} rounded-2xl p-4 shadow-md`}>
            {/* Peak Performance Time - Primary Insight */}
            <div className={`rounded-xl p-4 mb-3 ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <Clock className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium mb-1`}>PEAK PERFORMANCE</div>
                  <div className={`text-lg font-semibold ${textPrimary}`}>Mornings (9am - 12pm)</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You're 40% more productive before noon</div>
                </div>
              </div>
            </div>

            {/* Secondary Insights Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>BEST DAY</span>
                </div>
                <div className={`text-sm font-medium ${textPrimary}`}>Saturday</div>
                <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Highest avg energy</div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Target className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>TOP DRIVER</span>
                </div>
                <div className={`text-sm font-medium ${textPrimary}`}>Meetings</div>
                <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+35% energy boost</div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>AVOID</span>
                </div>
                <div className={`text-sm font-medium ${textPrimary}`}>Wed Afternoons</div>
                <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Energy typically dips</div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-[10px] font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>LONG-RANGE</span>
                </div>
                <div className={`text-sm font-medium ${textPrimary}`}>7/10</div>
                <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Goal alignment</div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats Cards - Option C Style */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className={`text-[10px] uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Avg Energy</span>
            </div>
            <div className={`text-2xl font-light ${textPrimary}`}>7.2</div>
            <div className="text-xs text-green-600">+12% this week</div>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className={`text-[10px] uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Focus Time</span>
            </div>
            <div className={`text-2xl font-light ${textPrimary}`}>36h</div>
            <div className="text-xs text-blue-600">86% efficiency</div>
          </div>
        </div>

        {/* Energy & Mood Chart - Cleaned Up */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base ${textSecondary}`}>Energy & Mood</h2>
            <button
              onClick={() => setActiveModal('energy-trends')}
              className="text-xs text-[#a58872] hover:underline"
            >
              Details
            </button>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart
                data={energyData}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const point = data.activePayload[0].payload;
                    setSelectedDataPoint({ day: point.day, value: point.value, type: 'energy' });
                  }
                }}
              >
                <XAxis
                  dataKey="day"
                  stroke={darkMode ? '#666' : '#999'}
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#333' : 'white',
                    color: darkMode ? '#eee' : '#333',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number) => [`${value}/10`, 'Energy']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a58872"
                  fill="url(#energyGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#a58872', stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                />
                <defs>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a58872" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a58872" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>

            {/* Interactive data point detail */}
            {selectedDataPoint && selectedDataPoint.type === 'energy' && (
              <div className={`mt-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-[#f5f1ed]'} animate-in fade-in duration-200`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-[#2a2520]'}`}>
                    {selectedDataPoint.day}'s Energy
                  </span>
                  <button
                    onClick={() => setSelectedDataPoint(null)}
                    className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-light ${darkMode ? 'text-amber-400' : 'text-[#a58872]'}`}>
                    {selectedDataPoint.value}/10
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedDataPoint.value >= 7 ? 'High energy day - great for deep work!' :
                     selectedDataPoint.value >= 5 ? 'Moderate energy - good for routine tasks' :
                     'Low energy - consider lighter activities'}
                  </div>
                </div>
              </div>
            )}

            <div className={`flex justify-between items-center pt-2 border-t mt-2 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Peak: Saturday (9)</span>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Low: Wednesday (4)</span>
            </div>
          </div>
        </section>

        {/* Focus Time Chart - Cleaned Up */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-base ${textSecondary}`}>Focus Time</h2>
            <button
              onClick={() => setActiveModal('focus-time')}
              className="text-xs text-[#a58872] hover:underline"
            >
              Details
            </button>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 shadow-sm`}>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={focusData}
                barGap={2}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const point = data.activePayload[0].payload;
                    setSelectedDataPoint({ day: point.day, value: point.actual, type: 'focus' });
                  }
                }}
              >
                <XAxis
                  dataKey="day"
                  stroke={darkMode ? '#666' : '#999'}
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#333' : 'white',
                    color: darkMode ? '#eee' : '#333',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}h`,
                    name === 'planned' ? 'Planned' : 'Actual'
                  ]}
                />
                <Bar dataKey="planned" fill={darkMode ? '#444' : '#e5ddd4'} radius={[6, 6, 0, 0]} cursor="pointer" />
                <Bar dataKey="actual" fill="#a58872" radius={[6, 6, 0, 0]} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>

            {/* Interactive data point detail */}
            {selectedDataPoint && selectedDataPoint.type === 'focus' && (
              <div className={`mt-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-[#f5f1ed]'} animate-in fade-in duration-200`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-[#2a2520]'}`}>
                    {selectedDataPoint.day}'s Focus Time
                  </span>
                  <button
                    onClick={() => setSelectedDataPoint(null)}
                    className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-light ${darkMode ? 'text-amber-400' : 'text-[#a58872]'}`}>
                    {selectedDataPoint.value}h
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {(() => {
                      const dayData = focusData.find(d => d.day === selectedDataPoint.day);
                      if (!dayData) return '';
                      const efficiency = Math.round((dayData.actual / dayData.planned) * 100);
                      return efficiency >= 90 ? `${efficiency}% efficiency - exceeded expectations!` :
                             efficiency >= 70 ? `${efficiency}% efficiency - solid performance` :
                             `${efficiency}% efficiency - room for improvement`;
                    })()}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${darkMode ? 'bg-[#444]' : 'bg-[#e5ddd4]'}`}></div>
                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#a58872] rounded-full"></div>
                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Actual</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Insights */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base text-[#8b7355]">Recent Insights</h2>
            <button
              onClick={() => setActiveModal('all-insights')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveModal('long-range')}
              className="bg-white/90 rounded-xl p-3 text-center hover:bg-white transition-colors shadow-sm"
            >
              <div className="text-xl mb-1">7/10</div>
              <div className="text-[10px] text-gray-600">Avg. Long-Range</div>
            </button>
            <button
              onClick={() => setActiveModal('energy-driver')}
              className="bg-white/90 rounded-xl p-3 text-center hover:bg-white transition-colors shadow-sm"
            >
              <div className="text-[10px] text-gray-600 mb-1">Top Energy Driver</div>
              <div className="text-xs text-[#2a2520]">Meetings</div>
            </button>
            <button
              onClick={() => setActiveModal('best-time')}
              className="bg-white/90 rounded-xl p-3 text-center hover:bg-white transition-colors shadow-sm"
            >
              <div className="text-[10px] text-gray-600 mb-1">Best Time</div>
              <div className="text-xs text-[#2a2520]">Morning</div>
            </button>
          </div>
        </section>

        {/* Reflection History */}
        <section className="mb-6">
          <h2 className="text-base text-[#8b7355] mb-3">Reflection History</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveModal('reflection-feb')}
              className="w-full bg-white/90 rounded-2xl p-4 flex items-center justify-between hover:bg-white transition-colors shadow-sm"
            >
              <div className="text-sm text-[#2a2520]">Feb 23, 2025</div>
              <div className="w-16 h-6">
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <path
                    d="M 0 15 Q 15 5, 30 15 T 60 15"
                    fill="none"
                    stroke="#a58872"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </button>
            <button
              onClick={() => setActiveModal('reflection-nov')}
              className="w-full bg-white/90 rounded-2xl p-4 flex items-center justify-between hover:bg-white transition-colors shadow-sm"
            >
              <div className="text-sm text-[#2a2520]">Nov 29, 2023</div>
              <div className="w-16 h-6">
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <path
                    d="M 0 20 Q 15 10, 30 20 T 60 15"
                    fill="none"
                    stroke="#a58872"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* Decorative sparkle */}
        <div className="text-center text-xl text-gray-300 mt-6">✦</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={onTabChange} onPlusClick={openQuickReflection} />
    </div>
  );
}