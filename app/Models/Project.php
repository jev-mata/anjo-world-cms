<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'contents';

    protected $fillable = [
        'title',
        'description',
        'group_contents_id',
        'video',
        'tab_title',
        'color',
        'image_path',
    ];

    public function group_contents()
    {
        return $this->belongsTo(GroupContents::class);
    }

    public function topics()
    {
        return $this->hasMany(Topics::class, 'content_id')->with('topics')->where('parent_id', '=', null);
    }
}
