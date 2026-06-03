// src/app/servers/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServer, useDeleteServer, useCreateMetric } from '@/hooks/useFleetData';
import AlertsList from '../AlertsList';
import MetricsChart from '../MetricsChart';

import { useState } from 'react';

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = parseInt(params.id as string);
  const { data: server, isLoading, error } = useServer(serverId);
  const deleteServer = useDeleteServer();
  const createMetric = useCreateMetric(serverId);
  
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [newMetric, setNewMetric] = useState({
    cpu_usage: '',
    memory_usage: '',
    disk_usage: '',
    network_in: '',
    network_out: '',
    recorded_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this server?')) {
      await deleteServer.mutateAsync(serverId);
      router.push('/servers');
    }
  };

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMetric.mutateAsync({
      cpu_usage: parseFloat(newMetric.cpu_usage),
      memory_usage: parseFloat(newMetric.memory_usage),
      disk_usage: parseFloat(newMetric.disk_usage),
      network_in: parseFloat(newMetric.network_in),
      network_out: parseFloat(newMetric.network_out),
      recorded_at: newMetric.recorded_at,
    });
    setShowMetricForm(false);
    setNewMetric({
      cpu_usage: '',
      memory_usage: '',
      disk_usage: '',
      network_in: '',
      network_out: '',
      recorded_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">Server not found</p>
        <button
          onClick={() => router.push('/servers')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Servers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{server.name}</h1>
          <p className="text-gray-500">{server.hostname} ({server.ip_address})</p>
          <p className="text-sm text-gray-400 mt-1">Environment: {server.environment}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMetricForm(!showMetricForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Metric
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteServer.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleteServer.isPending ? 'Deleting...' : 'Delete Server'}
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
              server.status === 'online' 
                ? 'bg-green-100 text-green-800'
                : server.status === 'degraded'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {server.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Checked</p>
            <p className="text-sm font-medium mt-1">
              {server.last_checked_at 
                ? new Date(server.last_checked_at).toLocaleString()
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm font-medium mt-1">
              {/* {new Date(server.created_at).toLocaleDateString()} */}
            </p>
          </div>
        </div>
      </div>

      {/* Add Metric Form */}
      {showMetricForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Metric</h3>
          <form onSubmit={handleAddMetric} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPU Usage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMetric.cpu_usage}
                  onChange={(e) => setNewMetric({...newMetric, cpu_usage: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memory Usage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMetric.memory_usage}
                  onChange={(e) => setNewMetric({...newMetric, memory_usage: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disk Usage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMetric.disk_usage}
                  onChange={(e) => setNewMetric({...newMetric, disk_usage: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network In (MB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMetric.network_in}
                  onChange={(e) => setNewMetric({...newMetric, network_in: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network Out (MB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newMetric.network_out}
                  onChange={(e) => setNewMetric({...newMetric, network_out: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recorded At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newMetric.recorded_at}
                  onChange={(e) => setNewMetric({...newMetric, recorded_at: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMetric.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {createMetric.isPending ? 'Saving...' : 'Save Metric'}
              </button>
              <button
                type="button"
                onClick={() => setShowMetricForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <AlertsList serverId={serverId} />
      </div>

      {/* Metrics Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <MetricsChart serverId={serverId} />
      </div>
    </div>
  );
}