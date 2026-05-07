"use client";

import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-6">
      <div className="flex gap-4 md:gap-8">
        <Skeleton className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl shrink-0" />
        <div className="flex-grow space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
              <Skeleton className="h-4 w-16 md:w-24" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-8 flex justify-between">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-8">
                <Skeleton className="w-28 h-28 rounded-[1.8rem]" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-[2rem]" />
                <Skeleton className="h-20 w-full rounded-[2rem]" />
            </div>
        </div>
    );
};
