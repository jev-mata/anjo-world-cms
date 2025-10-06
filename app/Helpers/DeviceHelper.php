<?php
// app/Helpers/DeviceHelper.php
namespace App\Helpers;

class DeviceHelper
{
    public static function getDeviceHash(): string
    {
        $ip = request()->ip();
        $ua = request()->userAgent();
        $cookieId = request()->cookie('device_id');

        if (!$cookieId) {
            $cookieId = bin2hex(random_bytes(16)); // random ID
            cookie()->queue(cookie('device_id', $cookieId, 60*24*365)); // store for 1 year
        }

        return hash('sha256', $ip . $ua . $cookieId);
    }
}
