import React from 'react';

export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-classic-card p-6 border border-classic-border">
      <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="py-20 bg-classic-bg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col items-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
