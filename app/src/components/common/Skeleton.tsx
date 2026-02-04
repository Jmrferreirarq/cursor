import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-muted/70';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: '',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? undefined : undefined),
  };

  if (animation === 'wave') {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className} relative overflow-hidden`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ['calc(-100%)', 'calc(100%)'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common patterns
export function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width={180} height={28} />
        </div>
        <Skeleton variant="rounded" width={56} height={56} />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </div>
    </motion.div>
  );
}

export function ProjectCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Image placeholder */}
      <Skeleton variant="rectangular" className="aspect-[16/10] w-full" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" width={70} height={20} />
          <Skeleton variant="rounded" width={50} height={20} />
        </div>
        <Skeleton variant="text" width="85%" height={24} />
        <Skeleton variant="text" width="60%" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="rounded" width={100} height={28} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
    </motion.div>
  );
}

export function StatCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Skeleton variant="rounded" width={16} height={16} />
        <Skeleton variant="text" width={100} height={14} />
      </div>
      <Skeleton variant="text" width={80} height={36} className="mb-1" />
      <Skeleton variant="text" width={120} height={14} />
    </motion.div>
  );
}

export function TableRowSkeleton({ columns = 5, delay = 0 }: { columns?: number; delay?: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="border-b border-border"
    >
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton variant="text" width={i === 0 ? '70%' : '50%'} />
        </td>
      ))}
    </motion.tr>
  );
}

export function ListItemSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
    >
      <Skeleton variant="rounded" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={18} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
      <Skeleton variant="rounded" width={80} height={32} />
    </motion.div>
  );
}

export function MediaCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <Skeleton variant="rectangular" className="aspect-[4/3] w-full" animation="wave" />
      <div className="p-4 space-y-2">
        <Skeleton variant="text" width="70%" height={18} />
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={50} height={20} />
          <Skeleton variant="rounded" width={60} height={20} />
        </div>
      </div>
    </motion.div>
  );
}

export function ChartSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="space-y-1">
            <Skeleton variant="text" width={120} height={18} />
            <Skeleton variant="text" width={80} height={14} />
          </div>
        </div>
        <Skeleton variant="rounded" width={60} height={24} />
      </div>
      {/* Chart area */}
      <div className="h-[250px] flex items-end justify-between gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1">
            <Skeleton 
              variant="rounded" 
              className="w-full" 
              height={`${30 + Math.random() * 60}%`}
              animation="wave"
            />
            <Skeleton variant="text" width="80%" height={12} className="mx-auto" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={200} height={16} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={250} height={16} />
        </div>
        <Skeleton variant="rounded" width={140} height={44} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} delay={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton delay={3} />
        <ChartSkeleton delay={4} />
      </div>
    </div>
  );
}

export function ProjectsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={200} height={36} />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={140} height={40} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={80} height={36} />
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} delay={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
