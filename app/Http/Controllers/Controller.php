<?php

namespace App\Http\Controllers;

use App\Models\GroupContents;
use App\Models\PageAnalytics;
use App\Models\Project;
use App\Models\TabAnalytics;

abstract class Controller
{
    //
    public function dashbord()
    {
        $projects = GroupContents::with(['projects.topics.content'])->get();
        foreach ($projects as $group) {
            // Get all topic IDs that belong to this group through its contents
            $topicIds = Project::whereHas('topics', function ($query) use ($group) {
                $query->where('group_contents_id', $group->id);
            })
                ->get()
                ->flatMap(fn ($project) => $project->topics->pluck('id'))
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
                ->groupBy(fn ($item) => $item->content->tab_title)
                ->map(fn ($items) => [
                    'tab_name' => $items->first()->content->tab_title,
                    'total' => $items->count(),
                ])
                ->values();
        }

        return $projects;
    }
}
