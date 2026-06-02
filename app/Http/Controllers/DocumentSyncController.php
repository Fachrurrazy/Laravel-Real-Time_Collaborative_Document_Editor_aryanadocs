<?php

namespace App\Http\Controllers;

use App\Models\DocumentActivity;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentSyncController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi data dari Hocuspocus Server
        $validated = $request->validate([
            'document_id' => 'required',
            'state' => 'required|array', // Menerima array bytes dari JS
            'user_id' => 'nullable'
        ]);

        // 2. Simpan ke tabel document_versions
        DB::table('document_versions')->insert([
            'document_id' => $validated['document_id'],
            // Kita simpan state dalam bentuk JSON string
            'state' => json_encode($validated['state']),
            'user_id' => $validated['user_id'],
            'created_at' => now()
        ]);

        return response()->json(['status' => 'saved'], 200);
    }

    public function trackActivity(Request $request)
    {
        $validated = $request->validate([
            'document_id' => 'required|integer|exists:documents,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'user_name' => 'required|string|max:191',
            'color' => 'nullable|string|max:20',
            'edits' => 'required|integer|min:1',
        ]);

        $activity = DocumentActivity::firstOrNew([
            'document_id' => $validated['document_id'],
            'user_id' => $validated['user_id'],
            'user_name' => $validated['user_name'],
        ]);

        $activity->user_color = $validated['color'] ?? $activity->user_color;
        $activity->edits = ($activity->edits ?? 0) + $validated['edits'];
        $activity->last_edited_at = now();
        $activity->save();

        return response()->json(['status' => 'tracked'], 200);
    }

    public function activity($id)
    {
        $activities = DocumentActivity::where('document_id', $id)
            ->orderByDesc('last_edited_at')
            ->get(['id', 'user_id', 'user_name', 'user_color', 'edits', 'last_edited_at']);

        return response()->json($activities);
    }

    public function state($id)
    {
        $version = DocumentVersion::where('document_id', $id)
            ->orderByDesc('created_at')
            ->first();

        if (! $version) {
            return response()->json(['state' => []], 200);
        }

        return response()->json([
            'state' => json_decode($version->state, true),
        ]);
    }
}