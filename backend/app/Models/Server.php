<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Server extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'hostname',
        'ip_address',
        'environment',
        'status',
        'last_checked_at',
    ];
    protected $casts = [
        'last_checked_at' => 'datetime',
    ];

    public function metrics()
    {
        return $this->hasMany(ServerMetric::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function latestMetric()
    {
        return $this->hasOne(ServerMetric::class)->latestOfMany('recorded_at');
    }

    public function isStale()
    {
        return $this->last_checked_at === null || $this->last_checked_at->diffInMinutes(now()) > 5;
    }



}
