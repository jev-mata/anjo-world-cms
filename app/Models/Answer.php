<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $fillable = [
        'question_id',
        'text',
        'is_correct', // boolean
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
