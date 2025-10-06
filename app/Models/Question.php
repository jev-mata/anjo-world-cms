<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'topic_id',
        'title',   // the actual question text
    ];
 
    public function topic()
    {
        return $this->belongsTo(Topics::class, 'topic_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
