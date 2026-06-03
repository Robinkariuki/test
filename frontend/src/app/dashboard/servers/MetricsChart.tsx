// src/app/components/servers/MetricsChart.tsx
'use client';

import { useServerMetrics } from '@/hooks/useFleetData';

interface MetricsChartProps {
  serverId: number;
}

export default function MetricsChart({ serverId }: MetricsChartProps) {
  const { data: metrics, isLoading } = useServerMetrics(serverId, 10);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No metrics available yet. Add some metrics to see charts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU Usage History */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">CPU Usage History</h4>
          <div className="space-y-2">
            {metrics.slice().reverse().map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24">
                  {new Date(metric.recorded_at).toLocaleTimeString()}
                </span>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full ${
                        metric.cpu_usage > 90 ? 'bg-red-500' :
                        metric.cpu_usage > 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${metric.cpu_usage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-12">{metric.cpu_usage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Usage History */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Memory Usage History</h4>
          <div className="space-y-2">
            {metrics.slice().reverse().map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-24">
                  {new Date(metric.recorded_at).toLocaleTimeString()}
                </span>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full ${
                        metric.memory_usage > 90 ? 'bg-red-500' :
                        metric.memory_usage > 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${metric.memory_usage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-12">{metric.memory_usage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}