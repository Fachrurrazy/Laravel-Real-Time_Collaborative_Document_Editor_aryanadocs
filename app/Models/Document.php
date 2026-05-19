<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DocumentVersion;
use App\Models\DocumentActivity;
use App\Models\User;

class Document extends Model
{
    protected $fillable = ['title', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function versions()
    {
        return $this->hasMany(DocumentVersion::class)->latest('created_at');
    }

    public function activities()
    {
        return $this->hasMany(DocumentActivity::class)->latest('last_edited_at');
    }
}
