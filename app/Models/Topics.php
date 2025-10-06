<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topics extends Model
{
    //

    protected $fillable = [
        'title',
        'description',
        'color',
        'video',
        'image_path',
        'content_id',
        'parent_id',
    ];

    // belongs to Content
    public function content()
    {
        return $this->belongsTo(Project::class, 'content_id');
    }

    // recursive relationship
    public function parent()
    {
        return $this->belongsTo(Topics::class, 'parent_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class,'topic_id','id')->with('answers');
    }
    public function topics()
    {

        return $this->hasMany(Topics::class, 'parent_id')->with('topics');
    }
}
