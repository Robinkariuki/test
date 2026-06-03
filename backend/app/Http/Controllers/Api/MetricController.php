<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Server;
use App\Models\ServerMetric;
use Illuminate\Http\JsonResponse;

class MetricController extends Controller
{


     
    public function index(Request $request, Server $server): JsonResponse
    {
     

        $metricsQuery = $server->metrics()->latestFirst();

        if ($request->has('since')) {
            $since = $request->input('since');
            $metricsQuery->since($since);
        }

        $metrics = $metricsQuery->get();

        return response()->json($metrics);
    }


        public function store(Request $request, Server $server): JsonResponse
        {
    
            $validated = $request->validate([
                'cpu_usage' => 'required|numeric|min:0|max:100',
                'memory_usage' => 'required|numeric|min:0|max:100',
                'disk_usage' => 'required|numeric|min:0|max:100',
                'network_in' => 'required|numeric|min:0',
                'network_out' => 'required|numeric|min:0',
                'recorded_at' => 'required|date',
            ]);
    
            $metric = $server->metrics()->create($validated);
    
            return response()->json($metric, 201);
        }


        public function scopeLatestFirst($query)
        {
        return $query->orderBy('recorded_at', 'desc');
        }

        public function scopeSince($query, $since)
        {
        return $query->where('recorded_at', '>=', $since);
        }
    

}
