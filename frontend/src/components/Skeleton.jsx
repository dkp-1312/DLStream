import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-base-300 rounded ${className}`}></div>
  );
};

export const MeetingCardSkeleton = () => (
  <div className="card h-full border border-base-300/80 bg-base-100 p-5 sm:p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2 mt-2">
      <Skeleton className="h-8 w-20 rounded-lg" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

export const NotificationSkeleton = () => (
  <div className="flex items-center gap-4 p-5 sm:p-6 bg-base-100/50 rounded-xl border border-base-300/50 mb-3">
    <Skeleton className="h-2.5 w-2.5 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export default Skeleton;
