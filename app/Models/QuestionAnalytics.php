<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'answer_id',
        'topic_id',
        'device_hash',
        'is_correct',
        'date'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class,'question_id','id');
    }

    public function answer()
    {
        return $this->belongsTo(Answer::class,'answer_id','id');
    }
}
