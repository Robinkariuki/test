<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Server;

class AlertController extends Controller
{
    
public function index(Request $request, Server $server)
    {
        $server = Server::findOrFail($serverId);

        $alertsQuery = $server->alerts()->latestFirst();

        if ($request->has('is_resolved')) {
            $isResolved = filter_var($request->input('is_resolved'), FILTER_VALIDATE_BOOLEAN);
            $alertsQuery->where('is_resolved', $isResolved);
        }

        if ($request->has('severity')) {
            $severity = $request->input('severity');
            $alertsQuery->where('severity', $severity);
        }

        $alerts = $alertsQuery->get();

        return response()->json($alerts);
    }

 public function resolve(Request $request, Server $server, $alertId)
    {
        $alert = $server->alerts()->findOrFail($alertId);

        if ($alert->is_resolved) {
            return response()->json(['message' => 'Alert is already resolved'], 400);
        }

        $alert->is_resolved = true;
        $alert->resolved_at = now();
        $alert->save();

        return response()->json(['message' => 'Alert marked as resolved']);
    }

    public function destroy(Server $server, $alertId)
    {
        $alert = $server->alerts()->findOrFail($alertId);
        $alert->delete();

        return response()->json(['message' => 'Alert deleted successfully'], 204);
    }

}
