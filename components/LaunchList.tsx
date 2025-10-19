'use client';

import { Launch } from '@/types';
import { LaunchCard } from './LaunchCard';

interface LaunchListProps {
  launches: Launch[];
}

export function LaunchList({ launches }: LaunchListProps) {
  return (
    <div className="space-y-4">
      {launches.map((launch) => (
        <div key={launch.id} className="md:max-w-4xl">
          <LaunchCard launch={launch} />
        </div>
      ))}
    </div>
  );
}