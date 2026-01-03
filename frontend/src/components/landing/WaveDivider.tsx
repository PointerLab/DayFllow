import React from 'react';

interface WaveDividerProps {
  fill?: string;
  flip?: boolean;
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ 
  fill = 'currentColor', 
  flip = false,
  className = '' 
}) => {
  return (
    <div className={`wave-divider ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px] lg:h-[100px]"
      >
        <path
          d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 60C960 50 1056 40 1152 45C1248 50 1344 70 1392 80L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export const WaveDividerAlt: React.FC<WaveDividerProps> = ({ 
  fill = 'currentColor', 
  flip = false,
  className = '' 
}) => {
  return (
    <div className={`wave-divider ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-[50px] md:h-[70px] lg:h-[90px]"
      >
        <path
          d="M0 40L60 45C120 50 240 60 360 65C480 70 600 70 720 60C840 50 960 30 1080 25C1200 20 1320 30 1380 35L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V40Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
