import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  hover3D?: boolean;
  className?: string;
}

/**
 * AnimatedCard - A card component with entrance animations and hover effects
 * Features: Fade-in on mount, 3D tilt on hover, elevation on hover
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  hover3D = true,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.23, 1, 0.32, 1] // Custom easing for smooth motion
      }}
      whileHover={hover3D ? {
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.3 }
      } : {
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`transform-gpu ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  ripple?: boolean;
  className?: string;
}

/**
 * AnimatedButton - An animated button with ripple effect and hover states
 * Features: Scale on hover, ripple effect on click, smooth transitions
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  variant = 'primary',
  ripple = true,
  className = '',
  onClick,
  ...props 
}) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      className={`relative overflow-hidden transform-gpu ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            opacity: 0.5
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            x: -200,
            y: -200
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.button>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition - Wrapper for page-level transitions
 * Features: Fade and slide transitions on page mount/unmount
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ 
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * StaggerContainer - Container that staggers the animation of its children
 * Features: Sequential animation of child elements
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * StaggerItem - Item to be used within StaggerContainer
 */
export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

/**
 * FloatingElement - Creates a floating/levitating animation
 * Features: Continuous up-down motion for visual interest
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className = '',
  amplitude = 10,
  duration = 3
}) => {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface GlowingElementProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

/**
 * GlowingElement - Adds pulsing glow effect
 * Features: Animated box-shadow for attention-grabbing effect
 */
export const GlowingElement: React.FC<GlowingElementProps> = ({ 
  children, 
  className = '',
  color = 'rgba(59, 130, 246, 0.5)'
}) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${color}`,
          `0 0 40px ${color}`,
          `0 0 20px ${color}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
