<?php


class AlertService
{
 private array $thresholds = [
        'cpu_usage' => 90,
        'memory_usage' => 90,
        'disk_usage' => 90,
    ];

    public function checkForAlerts(Server $server)
    {
        $latestMetric = $server->latestMetric;

        if (!$latestMetric) {
            return;
        }

        foreach ($this->thresholds as $metric => $threshold) {
            if ($latestMetric->$metric > $threshold) {
                Alert::create([
                    'server_id' => $server->id,
                    'type' => 'Performance',
                    'severity' => 'High',
                    'message' => ucfirst(str_replace('_', ' ', $metric)) . " is critically high.",
                ]);
            } else {
                // Optionally resolve existing alerts if the metric is back to normal
                Alert::where('server_id', $server->id)
                    ->where('type', 'Performance')
                    ->where('message', ucfirst(str_replace('_', ' ', $metric)) . " is critically high.")
                    ->where('is_resolved', false)
                    ->update(['is_resolved' => true, 'resolved_at' => now()]);
            }
        }
    }
}