interface TagPillProps {
  children: React.ReactNode;
  variant?: 'default' | 'stress';
  selected?: boolean;
}

export function TagPill({ children, variant = 'default', selected = true }: TagPillProps) {
  const baseClasses = "px-2.5 py-1 rounded-full text-xs transition-all";
  
  if (!selected) {
    return <span className={`${baseClasses} bg-gray-50 text-gray-400 border border-gray-200`}>{children}</span>;
  }
  
  const variantClasses =
    variant === 'stress'
      ? 'bg-orange-100 text-orange-700 border border-orange-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';

  return <span className={`${baseClasses} ${variantClasses}`}>{children}</span>;
}