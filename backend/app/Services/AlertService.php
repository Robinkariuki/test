<?php

namespace App\Services;

use App\Models\Server;
use App\Models\Alert;
use Illuminate\Support\Facades\Log;

class AlertService
{
    private array $thresholds = [
        'cpu_usage' => 90,
        'memory_usage' => 90,
        'disk_usage' => 90,
    ];

    public function checkForAlerts(Server $server): void
    {
        $latestMetric = $server->latestMetric;

        if (!$latestMetric) {
            return;
        }

        foreach ($this->thresholds as $metric => $threshold) {
            $metricValue = $latestMetric->$metric ?? 0;
            
            if ($metricValue > $threshold) {
                // Check if alert already exists to avoid duplicates
                $existingAlert = Alert::where('server_id', $server->id)
                    ->where('type', 'Performance')
                    ->where('metric_type', $metric)
                    ->where('is_resolved', false)
                    ->first();
                
                if (!$existingAlert) {
                    Alert::create([
                        'server_id' => $server->id,
                        'type' => 'Performance',
                        'severity' => $metricValue > 95 ? 'critical' : 'warning', // Match schema
                        'metric_type' => $metric,
                        'message' => ucfirst(str_replace('_', ' ', $metric)) . " is critically high at {$metricValue}%",
                        'threshold_value' => $threshold,
                        'actual_value' => $metricValue,
                    ]);
                    
                    Log::warning('Alert created', [
                        'server_id' => $server->id,
                        'metric' => $metric,
                        'value' => $metricValue
                    ]);
                }
            } else {
                // Resolve alert if metric is back to normal
                Alert::where('server_id', $server->id)
                    ->where('type', 'Performance')
                    ->where('metric_type', $metric)
                    ->where('is_resolved', false)
                    ->update([
                        'is_resolved' => true, 
                        'resolved_at' => now()
                    ]);
            }
        }
    }
}