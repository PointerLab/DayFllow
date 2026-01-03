import React from 'react';

interface CubeLogoProps {
  size?: number;
  className?: string;
}

export const CubeLogo: React.FC<CubeLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Isometric 3D Cube */}
      {/* Top face */}
      <path
        d="M20 4L36 13V13L20 22L4 13L20 4Z"
        fill="currentColor"
        fillOpacity="1"
      />
      {/* Left face */}
      <path
        d="M4 13L20 22V36L4 27V13Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      {/* Right face */}
      <path
        d="M36 13L20 22V36L36 27V13Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  );
};

export default CubeLogo;
