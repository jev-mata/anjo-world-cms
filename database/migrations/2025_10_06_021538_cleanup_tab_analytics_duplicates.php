<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Delete duplicates while keeping the lowest id per unique combination
        DB::statement("
            DELETE t1 FROM tab_analytics t1
            INNER JOIN tab_analytics t2
            ON t1.id > t2.id
            AND t1.content_id = t2.content_id
            AND t1.device_hash = t2.device_hash
            AND t1.date = t2.date
        ");
    }

    public function down(): void
    {
        // nothing to restore
    }
};
