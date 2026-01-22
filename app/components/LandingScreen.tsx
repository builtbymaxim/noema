import { useState, useEffect } from 'react';
import { User, Mail, ArrowRight, Sparkles, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logoImage from '../../assets/logo.jpg';

interface LandingScreenProps {
  onLogin: (email: string, password: string) => boolean;
  onSignUp: (email: string, password: string, name: string) => boolean;
  onGuest: () => void;
  isTransitioning?: boolean;
  authMethod?: 'login' | 'signup' | 'guest' | null;
  authError?: string | null;
}

type AuthView = 'main' | 'login' | 'signup';

export function LandingScreen({ onLogin, onSignUp, onGuest, isTransitioning, authMethod, authError }: LandingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);

  // Auth form state
  const [authView, setAuthView] = useState<AuthView>('main');
  const [viewTransition, setViewTransition] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Smooth transition between views
  const transitionToView = (newView: AuthView) => {
    setViewTransition(true);
    setTimeout(() => {
      setAuthView(newView);
      setLocalError(null);
      setTimeout(() => setViewTransition(false), 50);
    }, 200);
  };

  useEffect(() => {
    // Trigger mount animation
    setTimeout(() => setMounted(true), 100);
    setTimeout(() => setShowTagline(true), 800);
    setTimeout(() => setShowButtons(true), 1200);

    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Clear local error when switching views
  useEffect(() => {
    setLocalError(null);
  }, [authView]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = onLogin(email, password);
    if (!success) {
      setLocalError('Invalid email or password');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password || !name) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password.length < 4) {
      setLocalError('Password must be at least 4 characters');
      return;
    }

    const success = onSignUp(email, password, name);
    if (!success) {
      setLocalError('Account with this email already exists');
    }
  };

  const goBack = () => {
    setViewTransition(true);
    setTimeout(() => {
      setAuthView('main');
      setEmail('');
      setPassword('');
      setName('');
      setLocalError(null);
      setTimeout(() => setViewTransition(false), 50);
    }, 200);
  };

  const displayError = localError || authError;

  // Render login form
  if (authView === 'login') {
    return (
      <div className={`h-full bg-gradient-to-b from-[#f5f1ed] via-[#ebe5df] to-[#e5ddd4] flex flex-col relative overflow-hidden transition-all duration-300 ${isTransitioning ? 'scale-105 opacity-0' : viewTransition ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-[#a58872]/20 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col px-8 pt-8 relative z-10">
          {/* Back button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b5344] transition-colors mb-8 self-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-[#2a2520] mb-2">Welcome back</h2>
            <p className="text-sm text-[#8b7355]">Sign in to continue tracking your energy</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2a2520] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@noema.app"
                className="w-full bg-white border border-[#e5ddd4] rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a58872]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2520] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white border border-[#e5ddd4] rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a58872]/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {displayError}
              </div>
            )}

            {/* Test account hint */}
            <div className="bg-[#f5f1ed] rounded-xl p-4 text-xs text-[#8b7355]">
              <div className="font-medium mb-1">Test Account:</div>
              <div>Email: test@noema.app</div>
              <div>Password: test</div>
            </div>

            <button
              type="submit"
              disabled={isTransitioning}
              className="w-full bg-[#a58872] text-white py-4 rounded-2xl text-base font-medium shadow-lg hover:bg-[#8b7355] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {authMethod === 'login' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Switch to signup */}
          <div className="mt-6 text-center">
            <span className="text-sm text-[#8b7355]">Don't have an account? </span>
            <button
              onClick={() => transitionToView('signup')}
              className="text-sm text-[#a58872] font-medium hover:underline"
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render signup form
  if (authView === 'signup') {
    return (
      <div className={`h-full bg-gradient-to-b from-[#f5f1ed] via-[#ebe5df] to-[#e5ddd4] flex flex-col relative overflow-hidden transition-all duration-300 ${isTransitioning ? 'scale-105 opacity-0' : viewTransition ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-[#a58872]/20 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col px-8 pt-8 relative z-10">
          {/* Back button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b5344] transition-colors mb-8 self-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-[#2a2520] mb-2">Create account</h2>
            <p className="text-sm text-[#8b7355]">Start your journey to better energy management</p>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2a2520] mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border border-[#e5ddd4] rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a58872]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2520] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white border border-[#e5ddd4] rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a58872]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2520] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (min 4 chars)"
                  className="w-full bg-white border border-[#e5ddd4] rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a58872]/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isTransitioning}
              className="w-full bg-[#a58872] text-white py-4 rounded-2xl text-base font-medium shadow-lg hover:bg-[#8b7355] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {authMethod === 'signup' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-6 text-center">
            <span className="text-sm text-[#8b7355]">Already have an account? </span>
            <button
              onClick={() => transitionToView('login')}
              className="text-sm text-[#a58872] font-medium hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main landing view
  return (
    <div className={`h-full bg-gradient-to-b from-[#f5f1ed] via-[#ebe5df] to-[#e5ddd4] flex flex-col relative overflow-hidden transition-all duration-300 ${isTransitioning ? 'scale-105 opacity-0' : viewTransition ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-[#a58872]/20 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#a58872]/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* Logo with bounce-in animation */}
        <div className={`transition-all duration-1000 ease-out ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 -translate-y-10'}`}>
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-[#a58872]/30 rounded-full blur-2xl scale-150 animate-pulse-slow" />
            <img
              src={logoImage}
              alt="noema"
              className="h-32 w-32 object-contain relative z-10 rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* App name with staggered letter animation */}
        <div className={`mt-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl font-light text-[#2a2520] tracking-wider">
            {'noema'.split('').map((letter, i) => (
              <span
                key={i}
                className="inline-block animate-letter-bounce"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline with fade-in */}
        <div className={`mt-4 transition-all duration-700 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#8b7355] text-center text-sm leading-relaxed max-w-xs">
            Track your time & energy.<br />
            Understand your patterns.<br />
            Live more intentionally.
          </p>
        </div>

        {/* Sparkle decoration */}
        <div className={`mt-6 transition-all duration-500 ${showTagline ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <Sparkles className="w-6 h-6 text-[#d4a574] animate-sparkle-pulse" />
        </div>
      </div>

      {/* Buttons section */}
      <div className="px-8 pb-12 space-y-4 relative z-10">
        {/* Sign Up button - slides from left */}
        <button
          onClick={() => transitionToView('signup')}
          disabled={isTransitioning || viewTransition}
          className={`w-full bg-[#a58872] text-white py-4 rounded-2xl text-base font-medium shadow-lg hover:bg-[#8b7355] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 group disabled:opacity-70 ${
            showButtons ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
          }`}
          style={{ transitionDelay: showButtons ? '0ms' : '0ms', transitionDuration: '600ms' }}
        >
          <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Create Account</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Login button - slides from right */}
        <button
          onClick={() => transitionToView('login')}
          disabled={isTransitioning || viewTransition}
          className={`w-full bg-white text-[#2a2520] py-4 rounded-2xl text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-[#e5ddd4] flex items-center justify-center gap-3 group disabled:opacity-70 ${
            showButtons ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
          style={{ transitionDelay: showButtons ? '100ms' : '0ms', transitionDuration: '600ms' }}
        >
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Sign In</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Guest button - fades up from bottom */}
        <button
          onClick={onGuest}
          disabled={isTransitioning}
          className={`w-full text-[#8b7355] py-3 text-sm hover:text-[#6b5344] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } ${authMethod === 'guest' ? 'text-[#6b5344]' : ''}`}
          style={{ transitionDelay: showButtons ? '200ms' : '0ms', transitionDuration: '600ms' }}
        >
          {authMethod === 'guest' ? (
            <>
              <div className="w-4 h-4 border-2 border-[#8b7355] border-t-transparent rounded-full animate-spin" />
              <span>Entering...</span>
            </>
          ) : (
            <>
              <span>Continue as Guest</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Bottom decorative line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a58872]/30 to-transparent transition-all duration-1000 ${showButtons ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
