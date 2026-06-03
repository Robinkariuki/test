// src/app/components/servers/AlertsList.tsx
'use client';

import { useState } from 'react';
import { useServerAlerts, useResolveAlert } from '@/hooks/useFleetData';

interface AlertsListProps {
  serverId: number;
}

export default function AlertsList({ serverId }: AlertsListProps) {
  const [showResolved, setShowResolved] = useState(false);
  const { data: alerts, isLoading, refetch } = useServerAlerts(serverId, showResolved);
  const resolveAlert = useResolveAlert(serverId);

  const handleResolve = async (alertId: number) => {
    await resolveAlert.mutateAsync(alertId);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Fix: Use 'resolved' instead of 'is_resolved'
  const unresolvedAlerts = alerts?.filter(a => !a.resolved) || [];
  const resolvedAlerts = alerts?.filter(a => a.resolved) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Alerts</h3>
          <p className="text-sm text-gray-500">
            {unresolvedAlerts.length} active alerts
          </p>
        </div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showResolved ? 'Hide' : 'Show'} Resolved
        </button>
      </div>

      {unresolvedAlerts.length === 0 && !showResolved ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-green-700">No active alerts</p>
          <p className="text-sm text-green-600 mt-1">All systems are operational</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unresolvedAlerts.map((alert) => (
            <div key={alert.id} className="bg-white border rounded-lg p-4 shadow-sm">
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
                  className="ml-4 px-3 py-1 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  {resolveAlert.isPending ? 'Resolving...' : 'Resolve'}
                </button>
              </div>
            </div>
          ))}

          {showResolved && resolvedAlerts.map((alert) => (
            <div key={alert.id} className="bg-gray-50 border rounded-lg p-4 opacity-75">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                      RESOLVED
                    </span>
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
                  {alert.resolved_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Resolved: {new Date(alert.resolved_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}