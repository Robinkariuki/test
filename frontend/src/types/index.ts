// src/types/index.ts
export type ServerStatus = 'online' | 'degraded' | 'offline';
export type AlertSeverity = 'warning' | 'critical';

export type ServerMetric = {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  recorded_at: string;
};

export type Server = {
  id: number;
  name: string;
  hostname: string;
  ip_address: string;
  environment: string;
  status: ServerStatus;
  last_checked_at: string | null;
  latest_metric: ServerMetric | null;
  alerts_count: number;
};

export type Alert = {
  id: number;
  server_id: number;
  type: string;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  server: { id: number; name: string; hostname: string };
};

export type DashboardSummary = {
  total: number;
  online: number;
  degraded: number;
  offline: number;
  open_alerts: number;
  servers: Server[];
};