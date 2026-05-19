<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - AryanaDocs</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto py-10 px-4">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">My Documents</h1>
                <p class="text-gray-500 mt-1">Welcome back, {{ auth()->user()->name }}!</p>
            </div>
            <form action="{{ route('documents.store') }}" method="POST">
                @csrf
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow flex items-center gap-2 transition">
                    <span class="text-xl">+</span> New Document
                </button>
            </form>
        </div>

        <div class="grid gap-4">
            @forelse($documents as $doc)
                <a href="{{ route('documents.show', $doc->id) }}" class="bg-white p-5 rounded-xl shadow hover:shadow-md hover:-translate-y-1 transition flex justify-between items-center group">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-800 group-hover:text-blue-600">{{ $doc->title }}</h3>
                        <p class="text-sm text-gray-500 mt-1">Edited {{ $doc->updated_at->diffForHumans() }}</p>
                    </div>
                    <span class="text-gray-400 group-hover:text-blue-500">→</span>
                </a>
            @empty
                <div class="text-center py-12 bg-white rounded-xl shadow">
                    <p class="text-gray-500 text-lg">Belum ada dokumen.</p>
                    <p class="text-gray-400 text-sm mt-2">Klik "New Document" untuk mulai menulis!</p>
                </div>
            @endforelse
        </div>
    </div>
</body>
</html>