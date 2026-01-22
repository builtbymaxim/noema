interface AppContainerProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export function AppContainer({ children, darkMode = false }: AppContainerProps) {
  return (
    <div className={`relative w-full max-w-[390px] h-[844px] rounded-[3rem] overflow-hidden shadow-2xl transition-colors duration-300 ${
      darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f1ed]'
    }`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

      {/* Status Bar - positioned below notch */}
      <div className={`absolute top-7 left-0 right-0 h-7 bg-transparent z-40 px-8 flex items-center justify-between text-xs transition-colors duration-300 ${
        darkMode ? 'text-gray-300' : 'text-gray-800'
      }`}>
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          {/* Signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" className="currentColor">
            <path d="M0 9h2v3H0V9zm4-3h2v6H4V6zm4-3h2v9H8V3zm4-3h2v12h-2V0z" fill="currentColor"/>
          </svg>
          {/* WiFi */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="currentColor">
            <path d="M0 4.5C2.25 2.25 5.25 1 7.5 1s5.25 1.25 7.5 3.5M3 7.5C4.5 6 6 5.25 7.5 5.25S10.5 6 12 7.5M6 10.5c.5-.5 1-.75 1.5-.75s1 .25 1.5.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="currentColor">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor"/>
            <path d="M22.5 3.5v5c1 0 1.5-.5 1.5-2.5s-.5-2.5-1.5-2.5z" fill="currentColor"/>
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* App Content */}
      <div className="h-full pt-14 overflow-hidden">
        {children}
      </div>

      {/* Home Indicator */}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full z-40 transition-colors duration-300 ${
        darkMode ? 'bg-gray-600' : 'bg-gray-800/40'
      }`}></div>
    </div>
  );
}
