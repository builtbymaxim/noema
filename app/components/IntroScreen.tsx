interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#a58872] via-[#8b7355] to-[#6b5344]">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-32 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 text-white">
        <p className="text-lg mb-12 tracking-wide">Master Your Time & Energy.</p>
        
        <button
          onClick={onContinue}
          className="bg-white/90 text-[#6b5344] px-10 py-3.5 rounded-full hover:bg-white transition-colors"
        >
          Get Started
        </button>
      </div>

      {/* Decorative sparkle */}
      <div className="absolute bottom-16 right-8 text-white text-3xl opacity-70">✦</div>
    </div>
  );
}