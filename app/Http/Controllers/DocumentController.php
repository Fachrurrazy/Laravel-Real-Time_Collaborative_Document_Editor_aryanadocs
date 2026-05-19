<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function show($id)
    {
        $document = Document::findOrFail($id);
        $user = auth()->user();
        
        return view('documents.show', compact('document', 'user'));
    }
    
    public function store(Request $request)
    {
        $document = auth()->user()->documents()->create([
            'title' => $request->title ?: 'Untitled Document'
        ]);
        
        return redirect()->route('documents.show', $document->id);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $document->update([
            'title' => $request->title,
        ]);

        return response()->json([
            'status' => 'updated',
            'title' => $document->title,
        ]);
    }

    public function versions($id)
    {
        // Ambil 10 versi terakhir
        $versions = \App\Models\DocumentVersion::where('document_id', $id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'created_at', 'user_id']);

        return response()->json($versions);
    }

    public function restore($id, $versionId)
    {
        $version = \App\Models\DocumentVersion::findOrFail($versionId);

        return response()->json([
            'state' => json_decode($version->state, true),
            'message' => 'Version restored',
        ]);
    }
}