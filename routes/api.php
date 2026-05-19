<?php
use App\Http\Controllers\DocumentSyncController;
use Illuminate\Support\Facades\Route;

Route::post('/documents/sync', [DocumentSyncController::class, 'store']);
Route::post('/documents/activity', [DocumentSyncController::class, 'trackActivity']);
Route::get('/documents/{id}/activity', [DocumentSyncController::class, 'activity']);