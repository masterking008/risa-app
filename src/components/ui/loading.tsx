import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin', sizeClasses[size], className)}>
      <div className="w-full h-full border-2 border-transparent border-t-current border-r-current rounded-full opacity-75"></div>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4 rounded-md" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
      ))}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('p-6 bg-white rounded-lg border shadow-elegant animate-pulse', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton w-12 h-12 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 rounded w-3/4"></div>
          <div className="skeleton h-3 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton h-3 rounded"></div>
        <div className="skeleton h-3 rounded w-5/6"></div>
        <div className="skeleton h-3 rounded w-4/6"></div>
      </div>
    </div>
  );
}