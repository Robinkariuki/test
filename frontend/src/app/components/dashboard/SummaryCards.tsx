'use client';

import { useServers } from '@/hooks/useFleetData';

export default function SummaryCards() {
  const { data: servers, isLoading, error } = useServers();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading server data
      </div>
    );
  }

  const totalServers = servers?.length || 0;
  const onlineServers = servers?.filter(s => s.status === 'online').length || 0;
  const degradedServers = servers?.filter(s => s.status === 'degraded').length || 0;
  const offlineServers = servers?.filter(s => s.status === 'offline').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Total Servers</h3>
        <p className="text-3xl font-bold mt-2">{totalServers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Online</h3>
        <p className="text-3xl font-bold mt-2 text-green-600">{onlineServers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Degraded</h3>
        <p className="text-3xl font-bold mt-2 text-yellow-600">{degradedServers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Offline</h3>
        <p className="text-3xl font-bold mt-2 text-red-600">{offlineServers}</p>
      </div>
    </div>
  );
}