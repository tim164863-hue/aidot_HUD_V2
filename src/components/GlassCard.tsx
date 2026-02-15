import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <div
      className={`glass rounded-[20px] p-5 shadow-2xl transition-all duration-500 hover:border-white/10 ${className}`}
      style={{
        animation: `fadeIn 0.6s ease-out ${delay}s both`,
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
