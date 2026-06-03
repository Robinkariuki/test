'use client';

import SummaryCards from '@/app/components/dashboard/SummaryCards';
import AlertsFeed from '@/app/components/dashboard/AlertsFeed';
import ServerTable from '@/app/components/dashboard/ServerTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Real-time server fleet monitoring
        </div>
      </div>
      
      <SummaryCards />
      
      <div className="grid grid-cols-1 gap-6">
        <AlertsFeed />
      </div>
      
      <ServerTable />
    </div>
  );
}