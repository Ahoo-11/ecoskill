import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-eco-primary text-white shadow-soft hover:shadow-[0_18px_35px_rgba(16,185,129,0.35)]',
  secondary:
    'bg-white text-emerald-600 border border-emerald-100 hover:border-emerald-300 hover:text-emerald-700',
  success: 'bg-eco-sunshine text-emerald-900 shadow-[0_14px_30px_rgba(250,204,21,0.45)]'
};

const sizes = {
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
  sm: 'h-10 px-4 text-sm'
};

export const Button = forwardRef(
  ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    disabled,
    icon,
    iconPosition = 'left',
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.03 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        className={cn(
          'group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60',
          variants[variant] ?? variants.primary,
          sizes[size] ?? sizes.md,
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex items-center text-lg text-inherit opacity-90">{icon}</span>
        )}
        <span className="flex items-center gap-2">
          {loading && (
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            </span>
          )}
          <span>{children}</span>
        </span>
        {icon && iconPosition === 'right' && (
          <span className="flex items-center text-lg text-inherit opacity-90">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};
