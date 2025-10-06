<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageAnalytics extends Model
{
    use HasFactory;

    protected $table = 'page_analytics';

    protected $fillable = [
        'content_id',
        'device_hash',
        'date',
    ];
}
