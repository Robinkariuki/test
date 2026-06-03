// src/hooks/useFleetData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Alert, Server, ServerMetric } from '@/types';

// Get all servers
export function useServers() {
  return useQuery<Server[]>({
    queryKey: ['servers'],
    queryFn: () => api.get('/servers').then(r => r.data),
  });
}

// Get a single server with its metrics and alerts
export function useServer(serverId: number) {
  return useQuery<Server>({
    queryKey: ['servers', serverId],
    queryFn: () => api.get(`/servers/${serverId}`).then(r => r.data),
    enabled: !!serverId,
  });
}

// Get alerts for a specific server
export function useServerAlerts(serverId: number, resolved?: boolean) {
  return useQuery<Alert[]>({
    queryKey: ['servers', serverId, 'alerts', resolved],
    queryFn: () => {
      const params = resolved !== undefined ? { is_resolved: resolved } : {};
      return api.get(`/servers/${serverId}/alerts`, { params }).then(r => r.data);
    },
    enabled: !!serverId,
  });
}

// Get metrics for a specific server
export function useServerMetrics(serverId: number, limit?: number, since?: string) {
  return useQuery<ServerMetric[]>({
    queryKey: ['servers', serverId, 'metrics', limit, since],
    queryFn: () => {
      const params: any = {};
      if (limit) params.limit = limit;
      if (since) params.since = since;
      return api.get(`/servers/${serverId}/metrics`, { params }).then(r => r.data);
    },
    enabled: !!serverId,
  });
}

// Create a new server
export function useCreateServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Server>) => api.post('/servers', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });
}

// Update a server
export function useUpdateServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Server> & { id: number }) => 
      api.put(`/servers/${id}`, data).then(r => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['servers', data.id] });
    },
  });
}

// Delete a server
export function useDeleteServer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/servers/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.removeQueries({ queryKey: ['servers', id] });
    },
  });
}

// Create a metric for a server
export function useCreateMetric(serverId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ServerMetric>) => 
      api.post(`/servers/${serverId}/metrics`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers', serverId, 'metrics'] });
    },
  });
}

// Resolve an alert for a specific server
export function useResolveAlert(serverId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => 
      api.patch(`/servers/${serverId}/alerts/${alertId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers', serverId, 'alerts'] });
    },
  });
}