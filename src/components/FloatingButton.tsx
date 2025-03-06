import { type ReactNode } from 'react';

interface FloatingButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const FloatingButton = ({ href, children, className = '' }: FloatingButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 
                 transition-all duration-300 hover:scale-110 ${className}`}
    >
      {children}
    </a>
  );
};

export default FloatingButton;
