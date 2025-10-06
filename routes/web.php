<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Models\GroupContents;
use App\Models\PageAnalytics;
use App\Models\Project;
use App\Models\TabAnalytics;
use App\Models\Topics;

Route::get('/', function () {
    return redirect('/dashboard');
});
Route::get('/dashboard', function () {
    $projects = GroupContents::with(['projects.topics.content'])->get();
    foreach ($projects as $group) {
        // Get all topic IDs that belong to this group through its contents
        $topicIds = Project::whereHas('topics', function ($query) use ($group) {
            $query->where('group_contents_id', $group->id);
        }) 
        ->get()
        ->flatMap(fn($project) => $project->topics->pluck('id'))
        ->unique()
        ->values(); 
        // Today's analytics - count page views for all topics in this group
        $group->analytics_today = PageAnalytics::where('content_id', $group->id)
            ->whereDate('date', today())
            ->count();

        // Total analytics - count all page views for all topics in this group
        $group->analytics_total = PageAnalytics::where('content_id', $group->id)
            ->count();

        // Tabs usage - get tab analytics for all topics in this group
        $group->tab_stats = TabAnalytics::whereHas('content', function ($query) use ($group) {
            $query->where('group_contents_id', $group->id);
        })
        ->with('content:id,tab_title') // only fetch tab_title
        ->get()
        ->groupBy(fn($item) => $item->content->tab_title)
        ->map(fn($items) => [
            'tab_name' => $items->first()->content->tab_title,
            'total' => $items->count(),
        ])
        ->values();
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
Route::get('/analytics/view/{id}', [AnalyticsController::class, 'show'])->middleware(['auth', 'verified'])->name('analytics.show');
Route::post('/analytics/question', [AnalyticsController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('analytics.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/pages/view/{project}', [ProjectController::class, 'show'])->name('projects.show');

require __DIR__.'/auth.php';
