<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentActivity extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'user_name',
        'user_color',
        'edits',
        'last_edited_at',
    ];

    protected $casts = [
        'last_edited_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
