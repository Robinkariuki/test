<?php


class MetricIngestionService
{
    public function ingestMetrics($serverId, $metrics)
    {
        $server = Server::findOrFail($serverId);

        $serverMetric = new ServerMetric();
        $serverMetric->server_id = $server->id;
        $serverMetric->cpu_usage = $metrics['cpu_usage'] ?? null;
        $serverMetric->memory_usage = $metrics['memory_usage'] ?? null;
        $serverMetric->disk_usage = $metrics['disk_usage'] ?? null;
        $serverMetric->process_count = $metrics['process_count'] ?? 0;
        $serverMetric->network_in = $metrics['network_in'] ?? 0;
        $serverMetric->network_out = $metrics['network_out'] ?? 0;
        $serverMetric->save();

        // Update server status based on metrics
        if ($serverMetric->cpu_usage > 90 || $serverMetric->memory_usage > 90) {
            $server->status = 'degraded';
            Alert::create([
                'server_id' => $server->id,
                'type' => 'Performance',
                'severity' => 'High',
                'message' => 'CPU or Memory usage is critically high.',
            ]);
        } else {
            $server->status = 'online';
        }
        $server->last_checked_at = now();
        $server->save();

    
    }
}