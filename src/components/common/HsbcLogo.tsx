import React from 'react';

interface HsbcLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const HsbcSymbol: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      viewBox="0 0 200 100"
      className={`${className} shrink-0 drop-shadow-xs`}
      aria-label="HSBC"
    >
      {/* Top red triangle */}
      <polygon points="50,0 150,0 100,50" fill="#DB0011" />
      {/* Bottom red triangle */}
      <polygon points="50,100 150,100 100,50" fill="#DB0011" />
      {/* Left red wing triangle */}
      <polygon points="50,0 0,50 50,100" fill="#DB0011" />
      {/* Right red wing triangle */}
      <polygon points="150,0 200,50 150,100" fill="#DB0011" />
      {/* Central hourglass white triangles */}
      <polygon points="50,0 100,50 50,100" fill="#FFFFFF" />
      <polygon points="150,0 100,50 150,100" fill="#FFFFFF" />
    </svg>
  );
};

export const HsbcLogo: React.FC<HsbcLogoProps> = ({
  className = '',
  showText = true,
  textColor = 'text-white',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { symbol: 'h-5 w-10', text: 'text-base font-bold tracking-tight' },
    md: { symbol: 'h-7 w-14', text: 'text-xl font-extrabold tracking-tight' },
    lg: { symbol: 'h-9 w-18', text: 'text-2xl font-black tracking-tight' },
    xl: { symbol: 'h-12 w-24', text: 'text-3xl font-black tracking-tight' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <HsbcSymbol className={currentSize.symbol} />
      {showText && (
        <span className={`font-sans ${currentSize.text} ${textColor} tracking-tight`}>
          HSBC
        </span>
      )}
    </div>
  );
};
