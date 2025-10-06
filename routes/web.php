<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Models\GroupContents;
use App\Models\PageAnalytics;
use App\Models\Project;
use App\Models\TabAnalytics;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/dashboard');
}); 
Route::get('/dashboard', function () {
    $projects = GroupContents::all();
    foreach ($projects as $group) {
        $group->analytics_today = PageAnalytics::where('content_id', $group->id)
            ->whereDate('date', today())
            ->count();

        $group->analytics_total = PageAnalytics::where('content_id', $group->id)->count();

        // Tabs usage (group by tab_name)
        $group->tab_stats = TabAnalytics::select('tab_name', DB::raw('count(*) as total'))
            ->where('content_id', $group->id)
            ->groupBy('tab_name')
            ->get();
    }

    return inertia('Dashboard', [
        'groupcontents' => $projects,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
// routes/web.php
Route::post('/analytics/tab', function (Illuminate\Http\Request $request) {
    \App\Services\AnalyticsService::recordTabView($request->content_id, $request->tab_name);
    return response()->json(['status' => 'ok']);
});
Route::get('/analytics/view/{id}', [AnalyticsController::class,'show'])->middleware(['auth', 'verified'])->name('analytics.show');
Route::post('/analytics/question', [AnalyticsController::class,'store'])
    ->middleware(['auth', 'verified'])
    ->name('analytics.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/pages/view/{project}', [ProjectController::class, 'show'])->name('projects.show');
    
require __DIR__.'/auth.php';
