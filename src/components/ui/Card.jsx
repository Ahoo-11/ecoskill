import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, decoration, hoverGlow = true, ...props }) => {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-6 shadow-soft transition-all duration-300',
        hoverGlow && 'hover:shadow-card-hover hover:border-emerald-100',
        'backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {decoration && (
        <div className="pointer-events-none absolute inset-0 opacity-60">
          {decoration}
        </div>
      )}
      <div className={decoration ? 'relative' : undefined}>{children}</div>
    </motion.div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  decoration: PropTypes.node,
  hoverGlow: PropTypes.bool
};
