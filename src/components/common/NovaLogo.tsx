import React from 'react';

interface NovaLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NovaSymbol: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} shrink-0 drop-shadow-sm`}
      aria-label="Nova Digital Banking"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Hex Shield */}
      <polygon
        points="50,4 92,26 92,74 50,96 8,74 8,26"
        fill="#1C0407"
        stroke="#E11D48"
        strokeWidth="4"
      />
      {/* Dynamic Geometric Facets */}
      <polygon
        points="50,4 92,26 50,50"
        fill="#BE123C"
        opacity="0.9"
      />
      <polygon
        points="92,26 92,74 50,50"
        fill="#9F1239"
        opacity="0.8"
      />
      <polygon
        points="92,74 50,96 50,50"
        fill="#E11D48"
        opacity="0.95"
      />
      <polygon
        points="50,96 8,74 50,50"
        fill="#881337"
        opacity="0.85"
      />
      <polygon
        points="8,74 8,26 50,50"
        fill="#9F1239"
        opacity="0.75"
      />
      <polygon
        points="8,26 50,4 50,50"
        fill="#FB7185"
        opacity="0.9"
      />
      {/* Central Diamond Core */}
      <polygon
        points="50,30 68,50 50,70 32,50"
        fill="#FFFFFF"
        opacity="0.95"
      />
    </svg>
  );
};

export const NovaLogo: React.FC<NovaLogoProps> = ({
  className = '',
  showText = true,
  textColor = 'text-white',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { symbol: 'h-6 w-6', text: 'text-sm font-bold tracking-tight' },
    md: { symbol: 'h-8 w-8', text: 'text-lg font-extrabold tracking-tight' },
    lg: { symbol: 'h-10 w-10', text: 'text-xl font-black tracking-tight' },
    xl: { symbol: 'h-12 w-12', text: 'text-2xl font-black tracking-tight' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <NovaSymbol className={currentSize.symbol} />
      {showText && (
        <span className={`font-sans ${currentSize.text} ${textColor} tracking-tight`}>
          Nova<span className="text-rose-400 font-semibold">Bank</span>
        </span>
      )}
    </div>
  );
};
