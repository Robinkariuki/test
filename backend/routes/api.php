<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServerController;
use App\Http\Controllers\Api\MetricController;
use App\Http\Controllers\Api\AlertController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::apiResource('servers', ServerController::class);

Route::prefix('servers/{server}')->group(function () {
    Route::get('metrics', [MetricController::class, 'index']);
    Route::post('metrics', [MetricController::class, 'store']);
    Route::get('alerts', [AlertController::class, 'index']);
    Route::patch('alerts/{alert}/resolve', [AlertController::class, 'resolve']);
    Route::delete('alerts/{alert}', [AlertController::class, 'destroy']);
});
