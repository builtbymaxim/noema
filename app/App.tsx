import { useState, createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { X, Check, Flame, Briefcase, Dumbbell, Users, Coffee, GraduationCap } from 'lucide-react';
import { DashboardScreen } from './components/DashboardScreen';
import { WeeklyReflectionsScreen } from './components/WeeklyReflectionsScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LandingScreen } from './components/LandingScreen';
import { AppContainer } from './components/AppContainer';
import { Helper, HelperConfig } from './components/Helper';

// Type for saved reflections
export interface SavedReflection {
  id: string;
  title: string;
  value: number;
  energy: string;
  notes: string;
  learning: string;
  timestamp: Date;
}

// Type for connected calendars
export interface ConnectedCalendar {
  id: string;
  type: 'google' | 'icloud' | 'outlook';
  email: string;
  connected: boolean;
}

// Type for user settings
export interface UserSettings {
  darkMode: boolean;
  notifications: {
    moodCheckIns: boolean;
    weeklyDigest: boolean;
    smartReminders: boolean;
  };
  locations: {
    home: string;
    work: string;
    detectAutomatically: boolean;
  };
  helpers: {
    enabled: boolean;
    hiddenHelpers: string[]; // IDs of helpers user chose to never show
  };
}

// App context for global state
interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  connectedCalendars: ConnectedCalendar[];
  setConnectedCalendars: (calendars: ConnectedCalendar[]) => void;
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  streak: number;
  openQuickReflection: () => void;
  handleLogout: () => void;
}

// Helper function to interpolate colors based on percentage
const getColorForPercentage = (percent: number, isDark: boolean): string => {
  if (isDark) {
    // Dark mode: Deeper tones with amber accent
    if (percent <= 50) {
      const ratio = percent / 50;
      const r = Math.round(40 + (180 - 40) * ratio);
      const g = Math.round(30 + (130 - 30) * ratio);
      const b = Math.round(20 + (50 - 20) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const ratio = (percent - 50) / 50;
      const r = Math.round(180 + (245 - 180) * ratio);
      const g = Math.round(130 + (180 - 130) * ratio);
      const b = Math.round(50 + (80 - 50) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  } else {
    // Light mode: Original colors
    if (percent <= 50) {
      const ratio = percent / 50;
      const r = Math.round(61 + (165 - 61) * ratio);
      const g = Math.round(46 + (136 - 46) * ratio);
      const b = Math.round(31 + (114 - 31) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const ratio = (percent - 50) / 50;
      const r = Math.round(165 + (212 - 165) * ratio);
      const g = Math.round(136 + (165 - 136) * ratio);
      const b = Math.round(114 + (116 - 114) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// Screen order for determining transition direction
const screenOrder = ['home', 'insights', 'calendar', 'profile'] as const;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);
  const [authMethod, setAuthMethod] = useState<'login' | 'signup' | 'guest' | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'insights' | 'calendar' | 'profile'>('home');
  const [previousScreen, setPreviousScreen] = useState<'home' | 'insights' | 'calendar' | 'profile'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [darkMode, setDarkMode] = useState(false);
  const [streak, setStreak] = useState(7); // Mock streak
  const [connectedCalendars, setConnectedCalendars] = useState<ConnectedCalendar[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    notifications: {
      moodCheckIns: true,
      weeklyDigest: true,
      smartReminders: true,
    },
    locations: {
      home: '',
      work: '',
      detectAutomatically: true,
    },
    helpers: {
      enabled: true,
      hiddenHelpers: [],
    },
  });

  // Helper system state
  const [currentHelper, setCurrentHelper] = useState<HelperConfig | null>(null);
  const [dismissedHelpers, setDismissedHelpers] = useState<Set<string>>(new Set());
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [lastReflectionTime, setLastReflectionTime] = useState<Date | null>(null);
  const [justCompletedReflection, setJustCompletedReflection] = useState(false);
  const [reflectionStreak, setReflectionStreak] = useState(7); // Track streak for contextual helpers

  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([
    {
      id: '1',
      title: 'Morning standup',
      value: 4,
      energy: 'energized',
      notes: 'Good productive meeting',
      learning: 'Keep meetings short',
      timestamp: new Date('2026-01-05T09:30:00')
    },
    {
      id: '2',
      title: 'Deep work session',
      value: 5,
      energy: 'energized',
      notes: 'Completed the feature',
      learning: '',
      timestamp: new Date('2026-01-05T14:30:00')
    }
  ]);

  // Quick reflection modal state
  const [showQuickReflection, setShowQuickReflection] = useState(false);
  const [modalAnimationState, setModalAnimationState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [moodPercentage, setMoodPercentage] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [previousMood, setPreviousMood] = useState(50);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, opacity: number, size: number, glow: boolean}>>([]);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, size: number, delay: number, duration: number}>>([]);
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null);
  const [toast, setToast] = useState<{message: string, show: boolean}>({message: '', show: false});
  const [selectedActivityTag, setSelectedActivityTag] = useState<string | null>(null);
  const moodBarRef = useRef<HTMLDivElement>(null);

  // Swipe gesture state for screen navigation
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50; // Minimum distance to trigger swipe

  // Activity tags for quick reflection
  const activityTags = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'blue' },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'green' },
    { id: 'social', label: 'Social', icon: Users, color: 'purple' },
    { id: 'rest', label: 'Rest', icon: Coffee, color: 'amber' },
    { id: 'uni', label: 'Uni', icon: GraduationCap, color: 'indigo' },
  ];

  // Get last reflection info
  const getLastReflectionInfo = () => {
    if (savedReflections.length === 0) return null;
    const last = savedReflections[0];
    const moodValue = parseInt(last.notes.replace('Mood: ', '').replace('%', '')) || (last.value * 20);
    const timeDiff = Date.now() - new Date(last.timestamp).getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeAgo = '';
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      timeAgo = `${days}d ago`;
    } else if (hours > 0) {
      timeAgo = `${hours}h ago`;
    } else {
      timeAgo = `${minutes}m ago`;
    }

    return { mood: moodValue, timeAgo };
  };

  // Get recent moods for mini sparkline (last 7 reflections)
  const getRecentMoods = () => {
    return savedReflections.slice(0, 7).map(r => {
      const moodValue = parseInt(r.notes.replace('Mood: ', '').replace('%', '')) || (r.value * 20);
      return moodValue;
    }).reverse();
  };

  // Generate persistent bubbles for liquid effect
  useEffect(() => {
    if (showQuickReflection) {
      const newBubbles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 60,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2
      }));
      setBubbles(newBubbles);
    }
  }, [showQuickReflection]);

  // Check for milestone achievements
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const reached = milestones.find(m =>
      moodPercentage >= m && previousMood < m
    );
    if (reached && isDragging) {
      setMilestoneReached(reached);
      setTimeout(() => setMilestoneReached(null), 1000);
    }
  }, [moodPercentage, previousMood, isDragging]);

  // Get mood label based on percentage
  const getMoodLabel = (percent: number): { text: string; emoji: string } => {
    if (percent >= 90) return { text: 'Amazing!', emoji: '🌟' };
    if (percent >= 75) return { text: 'Great', emoji: '😊' };
    if (percent >= 50) return { text: 'Good', emoji: '🙂' };
    if (percent >= 25) return { text: 'Okay', emoji: '😐' };
    return { text: 'Low', emoji: '😔' };
  };

  const showToastMessage = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2000);
  };

  // Generate sparkle effects - more sparkles at higher percentages
  const generateSparkles = useCallback((direction: 'up' | 'down', baseMood: number) => {
    // Scale sparkle count: 2 at 0%, up to 12 at 100%
    const baseCount = direction === 'up' ? 3 : 2;
    const bonusCount = Math.floor((baseMood / 100) * 8); // 0-8 bonus sparkles based on mood
    const count = baseCount + bonusCount;

    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random() * 1000,
      x: Math.random() * 70 + 15, // Random x position within bar
      y: direction === 'up' ? baseMood : 100 - baseMood,
      opacity: 1,
      size: 0.5 + (baseMood / 100) * 1.5, // Bigger sparkles at higher moods
      glow: baseMood > 60 // Add extra glow for high moods
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    // Fade out sparkles
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 800);
  }, []);

  // Mood bar handlers
  const updateMoodFromPosition = useCallback((clientY: number) => {
    if (!moodBarRef.current) return;
    const rect = moodBarRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const newPercentage = Math.max(0, Math.min(100, 100 - (relativeY / rect.height) * 100));
    const rounded = Math.round(newPercentage);

    // Generate sparkles based on movement direction - more sparkles at higher moods
    if (rounded > previousMood + 3) {
      generateSparkles('up', rounded);
    } else if (rounded < previousMood - 3) {
      generateSparkles('down', rounded);
    }

    setPreviousMood(rounded);
    setMoodPercentage(rounded);
  }, [previousMood, generateSparkles]);

  const handleMoodTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateMoodFromPosition(e.touches[0].clientY);
  };

  const handleMoodTouchMove = (e: React.TouchEvent) => {
    if (isDragging) updateMoodFromPosition(e.touches[0].clientY);
  };

  const handleMoodTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      saveMoodReflection();
    }
  };

  const handleMoodMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateMoodFromPosition(e.clientY);
  };

  const handleMoodMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updateMoodFromPosition(e.clientY);
  };

  const handleMoodMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      saveMoodReflection();
    }
  };

  const saveMoodReflection = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    let energyTag: 'energized' | 'neutral' | 'drained' = 'neutral';
    if (moodPercentage >= 70) energyTag = 'energized';
    else if (moodPercentage <= 30) energyTag = 'drained';
    const value = Math.max(1, Math.min(5, Math.round(moodPercentage / 20)));

    const activityLabel = selectedActivityTag
      ? activityTags.find(t => t.id === selectedActivityTag)?.label
      : null;

    handleSaveReflection({
      title: activityLabel ? `${activityLabel} - ${timeStr}` : `Quick check-in at ${timeStr}`,
      value,
      energy: energyTag,
      notes: `Mood: ${moodPercentage}%${activityLabel ? ` | ${activityLabel}` : ''}`,
      learning: ''
    });

    // Track last reflection time for helper system
    setLastReflectionTime(now);
    setHasSeenOnboarding(true);

    // Update streak and trigger contextual helper
    setReflectionStreak(prev => prev + 1);
    setJustCompletedReflection(true);
    // Reset the flag after helpers have had a chance to show
    setTimeout(() => setJustCompletedReflection(false), 15000);

    showToastMessage(`${moodLabel.emoji} Mood saved!`);
    setTimeout(closeQuickReflection, 600);
  };

  const openQuickReflection = () => {
    setModalAnimationState('entering');
    setShowQuickReflection(true);
    setTimeout(() => setModalAnimationState('visible'), 50);
  };

  const closeQuickReflection = () => {
    setModalAnimationState('exiting');
    setTimeout(() => {
      setShowQuickReflection(false);
      setMoodPercentage(50);
      setPreviousMood(50);
      setSelectedActivityTag(null);
      setModalAnimationState('entering');
    }, 300);
  };

  const moodColor = getColorForPercentage(moodPercentage, darkMode);
  const moodLabel = getMoodLabel(moodPercentage);

  // Handle screen transitions with animation
  const handleScreenChange = useCallback((newScreen: 'home' | 'insights' | 'calendar' | 'profile') => {
    if (newScreen === currentScreen) return;

    const currentIndex = screenOrder.indexOf(currentScreen);
    const newIndex = screenOrder.indexOf(newScreen);
    const direction = newIndex > currentIndex ? 'left' : 'right';

    setTransitionDirection(direction);
    setIsTransitioning(true);
    setPreviousScreen(currentScreen);

    // After exit animation, switch screen and enter
    setTimeout(() => {
      setCurrentScreen(newScreen);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [currentScreen]);

  // Swipe gesture handlers for screen navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (!isHorizontalSwipe || Math.abs(distanceX) < minSwipeDistance) return;

    const isLeftSwipe = distanceX > 0;
    const currentIndex = screenOrder.indexOf(currentScreen);

    if (isLeftSwipe && currentIndex < screenOrder.length - 1) {
      // Swipe left → go to next screen
      handleScreenChange(screenOrder[currentIndex + 1]);
    } else if (!isLeftSwipe && currentIndex > 0) {
      // Swipe right → go to previous screen
      handleScreenChange(screenOrder[currentIndex - 1]);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, minSwipeDistance, currentScreen, handleScreenChange]);

  // Helper system - determine which helper to show (after handleScreenChange is defined)
  useEffect(() => {
    if (!settings.helpers.enabled || showQuickReflection) {
      setCurrentHelper(null);
      return;
    }

    const isHelperHidden = (id: string) =>
      settings.helpers.hiddenHelpers.includes(id) || dismissedHelpers.has(id);

    // Helper definitions with conditions and working actions
    const helpers: Array<{ config: HelperConfig; condition: () => boolean; priority: number }> = [
      // HIGHEST PRIORITY: Contextual helpers after completing a reflection
      {
        config: {
          id: 'streak-celebration',
          type: 'insight',
          message: `Amazing! You're on a ${reflectionStreak} day streak. Keep it going to unlock deeper insights about your patterns.`,
          autoDismissSeconds: 8,
        },
        condition: () => justCompletedReflection && reflectionStreak >= 7 && reflectionStreak % 7 === 0,
        priority: 1,
      },
      {
        config: {
          id: 'reflection-complete-insight',
          type: 'insight',
          message: savedReflections.length >= 5
            ? 'Your morning energy tends to be higher. Consider scheduling important tasks before noon.'
            : `Great check-in! ${5 - savedReflections.length} more reflections to unlock your first insight.`,
          autoDismissSeconds: 10,
        },
        condition: () => justCompletedReflection && currentScreen === 'home',
        priority: 2,
      },
      // Onboarding: First time user - show on home screen with arrow pointing to + button
      {
        config: {
          id: 'onboarding-quick-reflection',
          type: 'tip',
          message: 'Tap the + button anytime for a quick mood check-in. It only takes a few seconds.',
          highlightPlusButton: true,
        },
        condition: () => currentScreen === 'home' && !hasSeenOnboarding && savedReflections.length <= 2,
        priority: 3,
      },
      // AI suggestion / Mood-drainer detected - show on home screen
      {
        config: {
          id: 'ai-suggestion-available',
          type: 'insight',
          message: 'Based on your patterns, Wednesday meetings tend to drain your energy. Consider rescheduling.',
          actionLabel: 'View calendar',
          actionIcon: 'calendar',
          onAction: () => handleScreenChange('calendar'),
        },
        condition: () => currentScreen === 'home' && hasSeenOnboarding && savedReflections.length >= 5 && !justCompletedReflection,
        priority: 4,
      },
      // Contextual: No reflection today - show after 6pm
      {
        config: {
          id: 'no-reflection-today',
          type: 'reminder',
          message: "How's your day going? A quick check-in helps track your patterns.",
          actionLabel: 'Quick check-in',
          actionIcon: 'plus',
          onAction: () => openQuickReflection(),
        },
        condition: () => {
          const hour = new Date().getHours();
          return currentScreen === 'home' && hour >= 18 && !lastReflectionTime && hasSeenOnboarding && !justCompletedReflection;
        },
        priority: 5,
      },
      // Feature discovery: First visit to insights tab
      {
        config: {
          id: 'discover-insights',
          type: 'tip',
          message: 'See your energy patterns here. The more you log, the smarter the insights get.',
          actionLabel: 'Got it',
          actionIcon: 'chart',
          onAction: () => setCurrentHelper(null),
        },
        condition: () => currentScreen === 'insights' && !justCompletedReflection,
        priority: 6,
      },
      // Feature discovery: Calendar tab - scheduling tips
      {
        config: {
          id: 'discover-calendar',
          type: 'tip',
          message: 'Events are color-coded by type. Tap any event to see its energy impact.',
          actionLabel: 'Got it',
          actionIcon: 'sparkles',
          onAction: () => setCurrentHelper(null),
        },
        condition: () => currentScreen === 'calendar' && !justCompletedReflection,
        priority: 7,
      },
      // Smart trigger: Morning check-in (8-10am)
      {
        config: {
          id: 'morning-checkin',
          type: 'reminder',
          message: 'Good morning! How are you feeling today? Starting with a check-in sets a positive tone.',
          actionLabel: 'Quick check-in',
          actionIcon: 'plus',
          onAction: () => openQuickReflection(),
        },
        condition: () => {
          const hour = new Date().getHours();
          return currentScreen === 'home' && hour >= 8 && hour <= 10 && !lastReflectionTime && hasSeenOnboarding && !justCompletedReflection;
        },
        priority: 8,
      },
      // Smart trigger: Lunch break reminder (12-1pm)
      {
        config: {
          id: 'lunch-break-reminder',
          type: 'tip',
          message: 'Lunch break is a great time to reflect. How has your morning energy been?',
          actionLabel: 'Reflect now',
          actionIcon: 'plus',
          onAction: () => openQuickReflection(),
        },
        condition: () => {
          const hour = new Date().getHours();
          const hasReflectedToday = lastReflectionTime && new Date().toDateString() === lastReflectionTime.toDateString();
          return currentScreen === 'home' && hour >= 12 && hour <= 13 && !hasReflectedToday && hasSeenOnboarding && !justCompletedReflection;
        },
        priority: 9,
      },
      // Smart trigger: High activity detected
      {
        config: {
          id: 'high-activity-insight',
          type: 'insight',
          message: 'You\'ve been very active this week! Your energy average is trending upward. Keep up the great work!',
          autoDismissSeconds: 8,
        },
        condition: () => currentScreen === 'insights' && savedReflections.length >= 10 && !justCompletedReflection,
        priority: 10,
      },
      // Smart trigger: Profile achievements nudge
      {
        config: {
          id: 'achievement-nudge',
          type: 'tip',
          message: 'You\'re close to unlocking a new achievement! Check your progress in the achievements section.',
          actionLabel: 'View',
          actionIcon: 'sparkles',
          onAction: () => setCurrentHelper(null),
        },
        condition: () => currentScreen === 'profile' && savedReflections.length >= 3 && !justCompletedReflection,
        priority: 11,
      },
    ];

    // Sort helpers by priority and find first applicable
    const sortedHelpers = [...helpers].sort((a, b) => a.priority - b.priority);

    for (const { config, condition } of sortedHelpers) {
      if (!isHelperHidden(config.id) && condition()) {
        // Shorter delay for contextual helpers after reflection, longer for discovery helpers
        const delay = justCompletedReflection ? 800 : 1500;
        const timer = setTimeout(() => setCurrentHelper(config), delay);
        return () => clearTimeout(timer);
      }
    }

    setCurrentHelper(null);
  }, [
    settings.helpers.enabled,
    settings.helpers.hiddenHelpers,
    dismissedHelpers,
    hasSeenOnboarding,
    savedReflections.length,
    currentScreen,
    showQuickReflection,
    lastReflectionTime,
    justCompletedReflection,
    reflectionStreak,
    openQuickReflection,
    handleScreenChange,
  ]);

  // Helper handlers
  const dismissHelper = useCallback(() => {
    if (currentHelper) {
      setDismissedHelpers(prev => new Set([...prev, currentHelper.id]));
      if (currentHelper.id === 'onboarding-quick-reflection') {
        setHasSeenOnboarding(true);
      }
      setCurrentHelper(null);
    }
  }, [currentHelper]);

  const hideHelperPermanently = useCallback(() => {
    if (currentHelper) {
      setSettings(prev => ({
        ...prev,
        helpers: {
          ...prev.helpers,
          hiddenHelpers: [...prev.helpers.hiddenHelpers, currentHelper.id],
        },
      }));
      if (currentHelper.id === 'onboarding-quick-reflection') {
        setHasSeenOnboarding(true);
      }
      setCurrentHelper(null);
    }
  }, [currentHelper]);

  const handleSaveReflection = (reflection: Omit<SavedReflection, 'id' | 'timestamp'>) => {
    const newReflection: SavedReflection = {
      ...reflection,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setSavedReflections([newReflection, ...savedReflections]);
  };

  const handleUpdateReflection = (id: string, updates: Partial<Omit<SavedReflection, 'id' | 'timestamp'>>) => {
    setSavedReflections(prev => prev.map(r =>
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  const handleDeleteReflection = (id: string) => {
    setSavedReflections(prev => prev.filter(r => r.id !== id));
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
    setSettings({ ...settings, darkMode: value });
  };

  // Test accounts storage
  const [accounts, setAccounts] = useState<Array<{email: string, password: string, name: string}>>([
    { email: 'test@noema.app', password: 'test', name: 'Test User' }
  ]);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth handlers with transition animation
  const handleAuthSuccess = (method: 'login' | 'signup' | 'guest') => {
    setAuthMethod(method);
    setIsAuthTransitioning(true);
    setAuthError(null);
    // Wait for exit animation, then switch to authenticated state
    setTimeout(() => {
      setIsAuthenticated(true);
      // Reset transition state after entering home
      setTimeout(() => {
        setIsAuthTransitioning(false);
        setAuthMethod(null);
      }, 300);
    }, 600);
  };

  const handleLogin = (email: string, password: string): boolean => {
    const account = accounts.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );
    if (account) {
      handleAuthSuccess('login');
      return true;
    }
    return false;
  };

  const handleSignUp = (email: string, password: string, name: string): boolean => {
    const exists = accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return false;
    }
    setAccounts([...accounts, { email, password, name }]);
    handleAuthSuccess('signup');
    return true;
  };

  const handleGuest = () => handleAuthSuccess('guest');

  // Logout handler with transition
  const handleLogout = () => {
    setIsAuthTransitioning(true);
    // Reset helper state for clean login experience
    setHasSeenOnboarding(false);
    setDismissedHelpers(new Set());
    setCurrentHelper(null);
    // Wait for exit animation, then go back to landing
    setTimeout(() => {
      setIsAuthenticated(false);
      setCurrentScreen('home');
      // Reset transition state after landing page enters
      setTimeout(() => {
        setIsAuthTransitioning(false);
      }, 300);
    }, 400);
  };

  const contextValue: AppContextType = {
    darkMode,
    setDarkMode: handleDarkModeChange,
    connectedCalendars,
    setConnectedCalendars,
    settings,
    setSettings,
    streak,
    openQuickReflection,
    handleLogout,
  };

  // Show landing screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <AppContainer darkMode={false}>
          <LandingScreen
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onGuest={handleGuest}
            isTransitioning={isAuthTransitioning}
            authMethod={authMethod}
            authError={authError}
          />
        </AppContainer>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-900'}`}>
        <AppContainer darkMode={darkMode}>
          {/* Entry animation wrapper */}
          <div className={`h-full transition-all duration-500 ease-out ${isAuthTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Helper System */}
          {currentHelper && !showQuickReflection && (
            <Helper
              helper={currentHelper}
              darkMode={darkMode}
              onDismiss={dismissHelper}
              onNeverShow={hideHelperPermanently}
            />
          )}

          {/* Toast Notification */}
          {toast.show && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-[#2a2520] text-white px-6 py-3 rounded-full shadow-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                {toast.message}
              </div>
            </div>
          )}

          {/* Global Quick Reflection Modal */}
          {showQuickReflection && (
            <div
              className={`absolute inset-0 z-50 flex flex-col items-center justify-end transition-all duration-300 ${
                modalAnimationState === 'visible' ? 'bg-black/60' : 'bg-black/0'
              }`}
              onMouseMove={handleMoodMouseMove}
              onMouseUp={handleMoodMouseUp}
              onMouseLeave={handleMoodMouseUp}
              onClick={(e) => e.target === e.currentTarget && closeQuickReflection()}
            >
              {/* Modal container - animates up from bottom */}
              <div
                className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-t-[2rem] p-6 w-full shadow-2xl flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-out ${
                  modalAnimationState === 'visible'
                    ? 'translate-y-0 opacity-100 scale-100'
                    : modalAnimationState === 'exiting'
                    ? 'translate-y-full opacity-0 scale-95'
                    : 'translate-y-full opacity-0 scale-95'
                }`}
                style={{ maxHeight: '85vh' }}
              >
                {/* Decorative handle */}
                <div className={`w-12 h-1.5 rounded-full mb-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

                {/* Header - Centered and bigger */}
                <div className="w-full text-center mb-4 relative">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>
                    How are you feeling?
                  </h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Slide to express your mood
                  </p>
                  <button
                    onClick={closeQuickReflection}
                    className={`absolute right-0 top-0 p-1 rounded-full transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Last mood context + Streak indicator */}
                {(() => {
                  const lastInfo = getLastReflectionInfo();
                  const recentMoods = getRecentMoods();
                  return (
                    <div className={`w-full flex items-center justify-between px-4 py-2 rounded-xl mb-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        {lastInfo ? (
                          <>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Last: <span className="font-medium">{lastInfo.mood}%</span>
                            </span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {lastInfo.timeAgo}
                            </span>
                          </>
                        ) : (
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            First check-in!
                          </span>
                        )}
                        {/* Mini sparkline */}
                        {recentMoods.length >= 3 && (
                          <div className="flex items-end gap-0.5 h-4 ml-2">
                            {recentMoods.map((mood, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  i === recentMoods.length - 1
                                    ? darkMode ? 'bg-amber-400' : 'bg-[#a58872]'
                                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                                style={{ height: `${Math.max(4, (mood / 100) * 16)}px` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Streak indicator on right */}
                      <div className="flex items-center gap-1">
                        <Flame className={`w-3.5 h-3.5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span className={`text-xs font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                          {streak}d
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Activity Tags */}
                <div className="flex gap-2 mb-4 flex-wrap justify-center">
                  {activityTags.map(tag => {
                    const IconComponent = tag.icon;
                    const colorClasses = selectedActivityTag === tag.id
                      ? tag.color === 'blue'
                        ? darkMode ? 'bg-blue-900/60 text-blue-300 ring-2 ring-blue-500' : 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                        : tag.color === 'green'
                        ? darkMode ? 'bg-green-900/60 text-green-300 ring-2 ring-green-500' : 'bg-green-100 text-green-700 ring-2 ring-green-400'
                        : tag.color === 'purple'
                        ? darkMode ? 'bg-purple-900/60 text-purple-300 ring-2 ring-purple-500' : 'bg-purple-100 text-purple-700 ring-2 ring-purple-400'
                        : tag.color === 'indigo'
                        ? darkMode ? 'bg-indigo-900/60 text-indigo-300 ring-2 ring-indigo-500' : 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400'
                        : darkMode ? 'bg-amber-900/60 text-amber-300 ring-2 ring-amber-500' : 'bg-amber-100 text-amber-700 ring-2 ring-amber-400'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                    return (
                      <button
                        key={tag.id}
                        onClick={() => setSelectedActivityTag(selectedActivityTag === tag.id ? null : tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${colorClasses}`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{tag.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Percentage Display with mood emoji */}
                <div className="flex flex-col items-center mb-2">
                  <div
                    className={`text-3xl mb-1 transition-transform duration-200 ${isDragging ? 'scale-125' : 'scale-100'}`}
                  >
                    {moodLabel.emoji}
                  </div>
                  <div
                    className="text-5xl font-light transition-colors duration-150"
                    style={{ color: moodColor }}
                  >
                    {moodPercentage}%
                  </div>
                  <div
                    className={`text-sm font-medium mt-1 transition-colors duration-150 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    style={{ color: moodPercentage >= 50 ? moodColor : undefined }}
                  >
                    {moodLabel.text}
                  </div>
                </div>

                {/* Milestone celebration */}
                {milestoneReached && (
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-amber-900/50' : 'bg-amber-100'} shadow-lg`}>
                      <span className="text-lg mr-2">✨</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        {milestoneReached}% reached!
                      </span>
                    </div>
                  </div>
                )}

                {/* Mood Bar - Enhanced liquid effect */}
                <div
                  ref={moodBarRef}
                  className={`relative w-24 h-72 rounded-full overflow-hidden cursor-pointer select-none shadow-inner ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100'} ${isDragging ? 'scale-105' : 'scale-100'} transition-transform duration-150`}
                  onTouchStart={handleMoodTouchStart}
                  onTouchMove={handleMoodTouchMove}
                  onTouchEnd={handleMoodTouchEnd}
                  onMouseDown={handleMoodMouseDown}
                >
                  {/* Milestone markers */}
                  {[25, 50, 75].map(milestone => (
                    <div
                      key={milestone}
                      className={`absolute left-0 right-0 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} pointer-events-none z-10`}
                      style={{ bottom: `${milestone}%` }}
                    >
                      <span className={`absolute -right-6 -top-2 text-[8px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {milestone}
                      </span>
                    </div>
                  ))}

                  {/* Liquid Fill */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-75"
                    style={{
                      height: `${moodPercentage}%`,
                      background: darkMode
                        ? `linear-gradient(to top, #1a1208, ${moodColor})`
                        : `linear-gradient(to top, #3d2e1f, ${moodColor})`,
                    }}
                  >
                    {/* Shimmer effect */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 2s infinite linear',
                      }}
                    />

                    {/* Enhanced bubble effects */}
                    <div className="absolute inset-0 overflow-hidden">
                      {bubbles.map((bubble) => (
                        <div
                          key={bubble.id}
                          className="absolute rounded-full animate-bubble"
                          style={{
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            left: `${bubble.x}%`,
                            bottom: '0%',
                            background: moodPercentage > 60
                              ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,215,0,0.3))'
                              : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
                            animationDelay: `${bubble.delay}s`,
                            animationDuration: `${bubble.duration}s`,
                            boxShadow: moodPercentage > 60 ? '0 0 4px rgba(255,215,0,0.3)' : 'none',
                          }}
                        />
                      ))}
                    </div>

                    {/* Extra sparkle particles for high mood */}
                    {moodPercentage > 70 && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(Math.floor((moodPercentage - 70) / 5))].map((_, i) => (
                          <div
                            key={`extra-${i}`}
                            className="absolute animate-sparkle-pulse"
                            style={{
                              width: '4px',
                              height: '4px',
                              left: `${15 + Math.random() * 50}%`,
                              top: `${10 + Math.random() * 60}%`,
                              background: 'radial-gradient(circle, #ffd700, transparent)',
                              borderRadius: '50%',
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Wave Animation - Enhanced */}
                    <div className="absolute top-0 left-0 right-0 h-5 overflow-hidden">
                      <svg
                        viewBox="0 0 96 20"
                        className="w-[200%] h-full animate-wave"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 10 Q12 5, 24 10 T48 10 T72 10 T96 10 T120 10 T144 10 T168 10 T192 10 V20 H0 Z"
                          fill={moodColor}
                        />
                      </svg>
                    </div>

                    {/* Surface glow effect */}
                    <div
                      className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, ${moodColor}90, transparent)`,
                      }}
                    />

                    {/* Inner glow for high moods */}
                    {moodPercentage > 60 && (
                      <div
                        className="absolute inset-0 pointer-events-none animate-pulse"
                        style={{
                          background: `radial-gradient(ellipse at center 30%, ${moodColor}40, transparent 70%)`,
                        }}
                      />
                    )}
                  </div>

                  {/* Sparkle effects */}
                  {sparkles.map(sparkle => (
                    <div
                      key={sparkle.id}
                      className="absolute rounded-full animate-sparkle pointer-events-none"
                      style={{
                        left: `${sparkle.x}%`,
                        bottom: `${sparkle.y}%`,
                        width: `${sparkle.size * 10}px`,
                        height: `${sparkle.size * 10}px`,
                        background: sparkle.glow
                          ? 'radial-gradient(circle, #ffd700 0%, #ffaa00 40%, transparent 70%)'
                          : moodPercentage > 30
                            ? 'radial-gradient(circle, #d4a574 0%, transparent 70%)'
                            : 'radial-gradient(circle, #888 0%, transparent 70%)',
                        boxShadow: sparkle.glow
                          ? `0 0 ${sparkle.size * 15}px #ffd700, 0 0 ${sparkle.size * 8}px #ffaa00`
                          : moodPercentage > 30
                            ? `0 0 ${sparkle.size * 5}px #d4a574`
                            : `0 0 ${sparkle.size * 3}px #666`,
                      }}
                    />
                  ))}

                  {/* Drag Indicator */}
                  {isDragging && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-14 h-2 bg-white/90 rounded-full shadow-lg transition-all duration-75"
                      style={{ bottom: `${moodPercentage}%`, transform: 'translate(-50%, 50%)' }}
                    />
                  )}
                </div>

                {/* Bottom hint */}
                <p className={`text-xs mt-5 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {isDragging ? 'Release to save' : 'Drag up or down'}
                </p>

                {/* Quick mood buttons */}
                <div className="flex gap-3 mt-4">
                  {[
                    { emoji: '😔', value: 20 },
                    { emoji: '😐', value: 40 },
                    { emoji: '🙂', value: 60 },
                    { emoji: '😊', value: 80 },
                    { emoji: '🌟', value: 100 },
                  ].map(({ emoji, value }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setMoodPercentage(value);
                        setPreviousMood(value);
                        if (value >= moodPercentage + 10) {
                          generateSparkles('up', value);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        Math.abs(moodPercentage - value) < 15
                          ? darkMode ? 'bg-amber-900/50 scale-110' : 'bg-amber-100 scale-110'
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Screen transition wrapper with swipe gestures */}
          <div
            className={`h-full transition-all duration-200 ease-out ${
              isTransitioning
                ? transitionDirection === 'left'
                  ? 'opacity-0 -translate-x-4'
                  : 'opacity-0 translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentScreen === 'home' && (
              <DashboardScreen
                currentTab="home"
                onTabChange={(tab) => handleScreenChange(tab as 'home' | 'insights' | 'calendar' | 'profile')}
                savedReflections={savedReflections}
                onSaveReflection={handleSaveReflection}
                onUpdateReflection={handleUpdateReflection}
                onDeleteReflection={handleDeleteReflection}
              />
            )}
            {currentScreen === 'insights' && (
              <WeeklyReflectionsScreen
                currentTab="insights"
                onTabChange={(tab) => handleScreenChange(tab as 'home' | 'insights' | 'calendar' | 'profile')}
              />
            )}
            {currentScreen === 'calendar' && (
              <CalendarScreen
                currentTab="calendar"
                onTabChange={(tab) => handleScreenChange(tab as 'home' | 'insights' | 'calendar' | 'profile')}
              />
            )}
            {currentScreen === 'profile' && (
              <ProfileScreen
                currentTab="profile"
                onTabChange={(tab) => handleScreenChange(tab as 'home' | 'insights' | 'calendar' | 'profile')}
              />
            )}
          </div>
          </div>
        </AppContainer>
      </div>
    </AppContext.Provider>
  );
}
