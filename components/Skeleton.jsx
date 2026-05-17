"use client";

import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[3rem] p-4 md:p-12 space-y-4 md:space-y-8">
      <div className="flex gap-4 md:gap-8">
        {/* Avatar Skeleton */}
        <Skeleton className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl shrink-0" />
        
        <div className="flex-grow space-y-2 md:space-y-6 overflow-hidden">
          {/* Header Block */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-3">
              <Skeleton className="h-4 md:h-8 w-24 md:w-48 rounded-lg" />
              <Skeleton className="h-3 md:h-5 w-16 md:w-24 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 md:h-6 md:w-6 rounded-full" />
          </div>

          {/* Title and Content Block */}
          <div className="space-y-2 md:space-y-4">
            <Skeleton className="h-4 md:h-6 w-3/4 rounded-lg" />
            <div className="space-y-1 md:space-y-2">
              <Skeleton className="h-3 md:h-4 w-full rounded-md" />
              <Skeleton className="h-3 md:h-4 w-5/6 rounded-md" />
              <Skeleton className="h-3 md:h-4 w-2/3 rounded-md hidden md:block" />
            </div>
          </div>

          {/* Interaction Metrics Block */}
          <div className="flex items-center justify-between mt-4 md:mt-12 pt-2">
            <div className="flex items-center gap-4 md:gap-8">
              <Skeleton className="h-4 md:h-6 w-8 md:w-12 rounded-full" />
              <Skeleton className="h-4 md:h-6 w-8 md:w-12 rounded-full" />
              <Skeleton className="h-4 md:h-6 w-8 md:w-12 rounded-full" />
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Skeleton className="h-4 md:h-6 w-4 md:w-6 rounded-full" />
              <Skeleton className="h-4 md:h-6 w-4 md:w-6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
    return (
        <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                <div className="space-y-4 text-center md:text-left flex-grow">
                    <Skeleton className="h-8 md:h-12 w-48 md:w-64 mx-auto md:mx-0 rounded-xl" />
                    <Skeleton className="h-4 w-32 mx-auto md:mx-0 rounded-lg" />
                    <Skeleton className="h-16 w-full max-w-lg mx-auto md:mx-0 rounded-2xl mt-4" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <Skeleton className="h-24 w-full rounded-[2rem]" />
                <Skeleton className="h-24 w-full rounded-[2rem]" />
            </div>
        </div>
    );
};
