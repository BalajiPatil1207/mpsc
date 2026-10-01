import React from 'react';

const Skeleton = ({ className, width, height, rounded }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-white/10 ${className || ''}`}
      style={{ 
        width: width || '100%', 
        height: height || '1rem',
        borderRadius: rounded || '0.5rem'
      }}
    />
  );
};

export default Skeleton;
