import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const badgeShapes = {
  hex: 'clip-path-[polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]',
  circle: 'rounded-full'
};

export const Badge = ({
  title,
  icon,
  earned = false,
  shape = 'circle',
  glow = false,
  className
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <motion.div
        animate={earned && glow ? { boxShadow: ['0 0 0 rgba(16,185,129,0.4)', '0 0 30px rgba(16,185,129,0.35)'] } : undefined}
        transition={{ repeat: earned && glow ? Infinity : 0, repeatType: 'reverse', duration: 1.4 }}
        className={cn(
          'relative flex h-20 w-20 items-center justify-center bg-white/90 p-4 backdrop-blur shadow-soft',
          badgeShapes[shape] || badgeShapes.circle,
          earned ? 'text-emerald-600' : 'text-slate-400 grayscale',
          earned ? 'border border-emerald-100' : 'border border-slate-200',
          className
        )}
      >
        <span className="text-2xl">{icon}</span>
        {!earned && (
          <span className="absolute inset-0 rounded-full bg-white/70" aria-hidden />
        )}
      </motion.div>
      <span className="text-sm font-medium text-slate-600" title={title}>
        {title}
      </span>
    </motion.div>
  );
};

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  earned: PropTypes.bool,
  shape: PropTypes.oneOf(['circle', 'hex']),
  glow: PropTypes.bool,
  className: PropTypes.string
};
