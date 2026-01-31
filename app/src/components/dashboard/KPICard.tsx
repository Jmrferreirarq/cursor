import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  delay?: number;
}

export default function KPICard({
  title,
  children,
  icon: Icon,
  action,
  className = '',
  delay = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.05, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01 }}
      className={`bg-card border border-border rounded-xl p-5 shadow-card transition-all duration-200 hover:border-primary/20 hover:shadow-card-hover ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {action.label}
          </button>
        )}
      </div>
      <div>{children}</div>
    </motion.div>
  );
}
