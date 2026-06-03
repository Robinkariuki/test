'use client';

import { useState } from 'react';
import { useServers, useServerAlerts, useResolveAlert } from '@/hooks/useFleetData';
import Link from 'next/link';

export default function AlertsFeed() {
  const { data: servers, isLoading: serversLoading } = useServers();
  const [selectedServer, setSelectedServer] = useState<number | null>(null);
  
  // Get alerts for the first server by default
  const serverId = selectedServer || servers?.[0]?.id;
  const { data: alerts, isLoading: alertsLoading, refetch } = useServerAlerts(serverId || 0, false);
  const resolveAlert = useResolveAlert(serverId || 0);

  if (serversLoading || alertsLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Use 'resolved' property (not 'is_resolved')
  const activeAlerts = alerts?.filter(alert => !alert.resolved) || [];

  const handleResolve = async (alertId: number) => {
    await resolveAlert.mutateAsync(alertId);
    refetch(); // Refresh alerts after resolving
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Active Alerts</h2>
          {servers && servers.length > 0 && (
            <select 
              onChange={(e) => setSelectedServer(Number(e.target.value))}
              className="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedServer || servers[0]?.id || ''}
            >
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {activeAlerts.length} unresolved {activeAlerts.length === 1 ? 'alert' : 'alerts'}
        </p>
      </div>
      
      <div className="divide-y">
        {activeAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-500">No active alerts</p>
            <p className="text-sm text-gray-400 mt-1">All systems are operational</p>
          </div>
        ) : (
          activeAlerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      alert.severity === 'critical' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{alert.message}</p>
                  {alert.server && (
                    <p className="text-xs text-gray-500 mt-1">
                      Server: {alert.server.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleResolve(alert.id)}
                  disabled={resolveAlert.isPending}
                  className="ml-4 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resolveAlert.isPending ? 'Resolving...' : 'Resolve'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activeAlerts.length > 5 && (
        <div className="p-4 border-t text-center">
          <Link 
            href={`/servers/${serverId}/alerts`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all {activeAlerts.length} alerts →
          </Link>
        </div>
      )}
    </div>
  );
}