<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupContents extends Model
{
    //
     

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
