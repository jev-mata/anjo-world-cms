<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'contents_id',
        'question',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'contents_id', 'id');
    }
    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id', 'id');
    }

}
