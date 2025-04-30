<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $table="contents";
    protected $fillable = [
        'title',
        'description',
        'video',
        'image_path',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
