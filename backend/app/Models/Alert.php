<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    use HasFactory;
    protected $fillable = [
        'server_id',
        'type',
        'severity',
        'message',
        'is_resolved',
        'resolved_at',
    ];
    protected $casts = [
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];


    protected $dates = ['resolved_at'];
    
    protected $attributes = [
        'is_resolved' => false,
    ];

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }


    public function scopeResolved($query)
    {
        return $query->where('is_resolved', true);
    }

    public function scopeCritical($query)
    {
        return $query->where('severity', 'critical');
    }


    public function scopeWarning($query)
    {
        return $query->where('severity', 'warning');
    }


    public function markAsResolved(): bool
    {
        return $this->update([
            'is_resolved' => true,
            'resolved_at' => now(),
        ]);
    }

    public function isActive(): bool
    {
        return !$this->is_resolved;
    }


    public function getSeverityBadgeAttribute(): string
    {
        return match ($this->severity) {
            'critical' => 'danger',
            'warning' => 'warning',
            default => 'secondary',
        };
    }


    public function getAgeAttribute(): string
    {
        $now = now();
        $created = $this->created_at;
        $diffInSeconds = $now->diffInSeconds($created);

        if ($diffInSeconds < 60) {
            return $diffInSeconds . ' seconds ago';
        } elseif ($diffInSeconds < 3600) {
            return floor($diffInSeconds / 60) . ' minutes ago';
        } elseif ($diffInSeconds < 86400) {
            return floor($diffInSeconds / 3600) . ' hours ago';
        } else {
            return floor($diffInSeconds / 86400) . ' days ago';
        }
    }


    public function getResolvedAttribute(): bool
    {
        return $this->is_resolved;
    }

}
