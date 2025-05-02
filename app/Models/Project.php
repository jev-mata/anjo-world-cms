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
        'group_contents_id',
        'video',
        'image_path',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class,'contents_id','id');
    }
    public function group_contents()
    {
        return $this->belongsTo(GroupContents::class);
    }
    
}
