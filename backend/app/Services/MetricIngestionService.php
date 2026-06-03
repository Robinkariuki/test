<?php

namespace App\Services;

use App\Models\Server;
use App\Models\ServerMetric;
use App\Models\Alert;
use Illuminate\Support\Facades\DB;

class MetricIngestionService
{
    public function __construct(private AlertService $alertService)
    {
    }

    public function ingestMetrics(Server $server, array $metrics): ServerMetric
    {
        return DB::transaction(function () use ($server, $metrics) {
            $serverMetric = new ServerMetric();
            $serverMetric->server_id = $server->id;
            $serverMetric->cpu_usage = $metrics['cpu_usage'] ?? null;
            $serverMetric->memory_usage = $metrics['memory_usage'] ?? null;
            $serverMetric->disk_usage = $metrics['disk_usage'] ?? null;
            $serverMetric->process_count = $metrics['process_count'] ?? 0;
            $serverMetric->network_in = $metrics['network_in'] ?? 0;
            $serverMetric->network_out = $metrics['network_out'] ?? 0;
            $serverMetric->recorded_at = $metrics['recorded_at'] ?? now();
            $serverMetric->save();

            // Update server status based on metrics
            if ($serverMetric->cpu_usage > 90 || $serverMetric->memory_usage > 90) {
                $server->status = 'degraded';
            } else {
                $server->status = 'online';
            }
            $server->last_checked_at = now();
            $server->save();

            // Use AlertService to handle alerts
            $this->alertService->checkForAlerts($server);

            return $serverMetric;
        });
    }
}