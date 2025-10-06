<?php

// app/Services/AnalyticsService.php

namespace App\Services;

use App\Helpers\DeviceHelper;
use App\Models\PageAnalytics;
use App\Models\TabAnalytics;
use Carbon\Carbon;

class AnalyticsService
{
    public static function recordPageView($contentId)
    {
        $deviceHash = DeviceHelper::getDeviceHash();
        $today = Carbon::today()->toDateString();

        PageAnalytics::firstOrCreate([
            'content_id' => $contentId,
            'device_hash' => "$deviceHash-$today-$contentId",
            'date' => $today,
        ]);
    }

    public static function recordTabView($contentId, $tabName)
    {
        $deviceHash = DeviceHelper::getDeviceHash();
        $today = Carbon::today()->toDateString();

        return TabAnalytics::firstOrCreate([
            'device_hash' => "$deviceHash-$today-$contentId-$tabName",
        ], [
            'content_id' => $contentId,
            'tab_name' => $tabName,
            'date' => $today,
            'updated_at' => now(),
         ]);
    }
}
