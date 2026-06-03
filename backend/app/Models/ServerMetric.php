<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServerMetric extends Model
{
    use HasFactory;
    protected $fillable = [
        'server_id',
        'cpu_usage',
        'memory_usage',
        'disk_usage',
        'network_in',
        'network_out',
        'recorded_at',
    ];
    protected $casts = [
        'recorded_at' => 'datetime',
        'cpu_usage' => 'float',
        'memory_usage' => 'float',
        'disk_usage' => 'float',
        'network_in' => 'float',
        'network_out' => 'float',   

    ];

    protected $dates = ['recorded_at'];

    public function server()
    {
        return $this->belongsTo(Server::class);
    }
   public function scopeSince($query, $dateTime)
    {
        return $query->where('recorded_at', '>=', $dateTime);
    }

   public function scopeLatestFirst($query)
    {
        return $query->orderBy('recorded_at', 'desc');
    }

   public function scopeOldestFirst($query)
    {
        return $query->orderBy('recorded_at', 'asc');
    }

   public function isHighLoad(): bool
    {
        return ($this->cpu_usage && $this->cpu_usage > 90) || 
               ($this->memory_usage && $this->memory_usage > 90);
    }

   public function isWarningLevel(): bool
    {
        $warningThreshold = 75;
        return (($this->cpu_usage && $this->cpu_usage > $warningThreshold) || 
                ($this->memory_usage && $this->memory_usage > $warningThreshold)) && 
               !$this->isHighLoad();
    }

  public function getSummaryAttribute(): array
    {
        return [
            'cpu' => $this->cpu_usage ? round($this->cpu_usage, 2) : null,
            'memory' => $this->memory_usage ? round($this->memory_usage, 2) : null,
            'disk' => $this->disk_usage ? round($this->disk_usage, 2) : null,
            'processes' => $this->process_count,
            'network_in' => $this->network_in,
            'network_out' => $this->network_out,
            'recorded_at' => $this->recorded_at?->toIso8601String(),
        ];
    }

   public function getCpuUsageFormattedAttribute(): string
    {
        return $this->cpu_usage ? round($this->cpu_usage, 1) . '%' : 'N/A';
    }



    public function getDiskUsageFormattedAttribute(): string
    {
        return $this->disk_usage ? round($this->disk_usage, 1) . '%' : 'N/A';
    }
    
}
