<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupContents extends Model
{
    //
     

    protected $fillable = [
        'title',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
