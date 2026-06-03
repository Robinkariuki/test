<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ServerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(): JsonResponse
    {
        $servers = Server::with('latestMetric')
            ->withCount(['alerts' => function ($query) {
                $query->where('is_resolved', false);
            }])
            ->orderBy('status', 'desc')
            ->get();

        return response()->json($servers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hostname' => 'required|string|max:255|unique:servers',
            'ip_address' => 'required|ip|unique:servers',
            'environment' => 'required|string|max:50',
            'status' => 'required|in:online,degraded,offline',
        ]);

        $server = Server::create($validated);

        return response()->json($server, 201);
    }

    /**
     *
     * Display the specified resource.
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id): JsonResponse
    {
        //
        $server = Server::with('metrics', 'alerts')->findOrFail($id);
        return response()->json($server);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'hostname' => 'sometimes|required|string|max:255|unique:servers,hostname,' . $id,
            'ip_address' => 'sometimes|required|ip|unique:servers,ip_address,' . $id,
            'environment' => 'sometimes|required|string|max:50',
            'status' => 'sometimes|required|in:online,degraded,offline',
        ]);

        $server = Server::findOrFail($id);
        $server->update($validated);

        return response()->json($server);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): JsonResponse
    {
        $server = Server::findOrFail($id);
        $server->delete();

        return response()->json(['message' => 'Server deleted successfully'],204);
    }
}
