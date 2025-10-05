import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const getProgressColor = (value) => {
  if (value <= 30) return 'bg-rose-500';
  if (value <= 70) return 'bg-amber-400';
  return 'bg-eco-primary';
};

export const ProgressBar = ({
  value = 0,
  showLabel = true,
  className,
  thickness = 'h-3'
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={cn('overflow-hidden rounded-full bg-slate-200/60', thickness)}>
        <motion.div
          className={cn('h-full rounded-full shadow-inner transition-colors duration-300', getProgressColor(clampedValue))}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ type: 'spring', stiffness: 75, damping: 20 }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  thickness: PropTypes.string
};
