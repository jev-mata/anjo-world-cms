<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TabAnalytics extends Model
{
    use HasFactory;

    protected $table = 'tab_analytics';

    protected $fillable = [
        'content_id',
        'tab_name',
        'device_hash',
        'date',
    ];
    public function content()
    {
        return $this->belongsTo(Project::class, 'content_id');
    }
}
