<?php

namespace App\Http\Controllers;

use App\Helpers\DeviceHelper;
use App\Models\GroupContents;
use App\Models\PageAnalytics;
use App\Models\Question;
use App\Models\QuestionAnalytics;
use App\Models\TabAnalytics;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    //
    public function Store(Request $request)
    {

        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'answer_id' => 'required|exists:answers,id',
            'topic_id' => 'nullable|integer',
            'is_correct' => 'required|boolean',
        ]);

        $deviceHash = DeviceHelper::getDeviceHash();
        QuestionAnalytics::create([
            'device_hash' => "$deviceHash-$validated[question_id]-$validated[topic_id]",
            ...$validated,
            'date' => now()->toDateString(),
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function show(Request $request, $id)
    {
        $group = GroupContents::with('projects')->findOrFail($id);

        // ✅ Handle filters
        $filter = $request->query('filter', 'today');
        $dateRange = match ($filter) {
            'yesterday' => [now()->subDay()->startOfDay(), now()->subDay()->endOfDay()],
            'this_week' => [now()->startOfWeek(), now()->endOfWeek()],
            'last_week' => [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()],
            'this_month' => [now()->startOfMonth(), now()->endOfMonth()],
            'last_month' => [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()],
            'this_year' => [now()->startOfYear(), now()->endOfYear()],
            'last_year' => [now()->subYear()->startOfYear(), now()->subYear()->endOfYear()],
            default => [now()->startOfDay(), now()->endOfDay()],
        };

        // Debug: Check what data exists without filters
        $allQuestionAnalytics = QuestionAnalytics::where('topic_id', $id)->get();
        Log::info('All QuestionAnalytics for topic_id '.$id.':', $allQuestionAnalytics->toArray());

        // Debug: Check with date filter only
        $dateFiltered = QuestionAnalytics::where('topic_id', $id)
            ->whereBetween('date', [$dateRange[0], $dateRange[1]])
            ->get();
        Log::info('Date filtered QuestionAnalytics:', $dateFiltered->toArray());

        // ✅ Page views over time
        $views = PageAnalytics::select(DB::raw('DATE(date) as day'), DB::raw('COUNT(*) as total'))
            ->where('content_id', $id)
            ->whereBetween('date', [$dateRange[0], $dateRange[1]])
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        // ✅ Tab interactions
        // ✅ Tab interactions - SIMPLER VERSION
        $tabs = TabAnalytics::with('topic.content')
            ->select('tab_name', DB::raw('COUNT(*) as total'))
            ->whereHas('topic.content.group_contents', function ($query) use ($id) {
                $query->where('id', $id);
            })
            ->whereBetween('date', [$dateRange[0], $dateRange[1]])
            ->groupBy('tab_name')
            ->get()
            ->map(function ($tab) {
                // Use the content's tab_title if available, otherwise use tab_name
                return [
                    'tab_name' => $tab->topic->content->tab_title ?? $tab->tab_name,
                    'total' => $tab->total,
                ];
            });

        Log::info('tabs:', $tabs->toArray());
        // ✅ Overall correct vs incorrect - FIXED VERSION
        $questionStats = QuestionAnalytics::whereHas('question.topic.content.group_contents', function ($query) use ($id) {
            $query->where('id', $id);
        })->
        select('is_correct', DB::raw('COUNT(*) as total')) 
            ->whereBetween('date', [$dateRange[0], $dateRange[1]])
            ->groupBy('is_correct')
            ->get()
            ->map(function ($item) {
                $item->label = $item->is_correct ? 'Correct Answers' : 'Incorrect Answers';

                return $item;
            });

        // ✅ Per-question breakdown - FIXED VERSION
        $questionBreakdown = QuestionAnalytics::whereHas('question.topic.content.group_contents', function ($query) use ($id) {
            $query->where('id', $id);
        })
            ->select(
                'question_id',
                DB::raw('SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_count'),
                DB::raw('SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as incorrect_count'),
                DB::raw('COUNT(*) as total_attempts')
            )
            ->whereBetween('date', [$dateRange[0], $dateRange[1]])
            ->groupBy('question_id')
            ->get()
            ->map(function ($row) {
                $question = Question::with('topic.content')->find($row->question_id);
                $row->question_title = $question?->title ?? 'Unknown Question (ID: '.$row->question_id.')';
                $row->topic_name = $question?->topic?->title ?? 'Unknown Topic';
                $row->content_name = $question?->topic?->content?->title ?? 'Unknown Content';
                $row->accuracy = $row->total_attempts > 0
                    ? round(($row->correct_count / $row->total_attempts) * 100, 1)
                    : 0;

                return $row;
            });

        Log::info('Question Breakdown:', $questionBreakdown->toArray());

        return inertia('Analytics/Show', [
            'group' => $group,
            'filter' => $filter,
            'views' => $views,
            'tabs' => $tabs,
            'questionStats' => $questionStats,
            'questionBreakdown' => $questionBreakdown,
            'dateRange' => [
                'from' => $dateRange[0]->format('M j, Y'),
                'to' => $dateRange[1]->format('M j, Y'),
            ],
        ]);
    }
}
