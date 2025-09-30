<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\GroupContents;
use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Show the project creation form
    public function create()
    {
        return Inertia::render('CMS/create');
    }

    // Store a newly created project in the database
    public function show($id)
    {
        $project = GroupContents::with('projects.topics')->findOrFail($id); // eager load relations

        Log::error($project);

        return Inertia::render('CMS/Show', [
            'groupcontent' => $project,
        ]);
    }

    public function delete(Request $request)
    {

        $ids = $request->input('ids');

        $ids = is_array($ids) ? $ids : explode(',', $ids);

        Project::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Project Deleted successfully!',
            'deleted' => true,
        ], 201);
    }

    public function edit_show($id)
    {
        $project = GroupContents::with('projects.topics')->findOrFail($id); // eager load relations

        return response()->json($project);
    }

    public function store(Request $request)
    {
        // ✅ Validate input
        $validated = $request->validate([
            'group_contents_id' => 'required',
            'title' => 'required|string|max:255',
            'id' => 'required',
            'description' => 'required|string',
            'color' => 'required|string',
            'video' => 'nullable|string',
            'tab_title' => 'nullable|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'topics' => 'nullable|array',
        ]);

        // ✅ Build update data
        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'],
            'color' => $validated['color'],
            'tab_title' => $validated['tab_title'] ?? $validated['title'],
            'group_contents_id' => $validated['group_contents_id'],
            'video' => $validated['video'] ?? null,
        ];
        // ✅ Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            $data['image_path'] = $imagePath;
        }
        if ($request->filled('removed_topics')) {
            $ids = json_decode($request->removed_topics, true);
            if (is_array($ids)) {
                \App\Models\Topics::whereIn('id', $ids)->delete();
            }
        }
        // ✅ Save project

        $project = Project::updateOrCreate(
            ['id' => $validated['id'] ?? null],
            $data
        );

        // ✅ Decode topics JSON
        if (! empty($validated['topics'])) {
            // Recursive save
            // $project->topics()->delete();

            $this->saveTopicsRecursive($validated['topics'], null, $project->id);
        }

        return response()->json([
            'message' => 'Project created successfully!',
            'data' => $project->load('topics'),
        ], 201);
    }

    protected function saveTopicsRecursive(array $topics, $parentId, $projectId)
    {
        foreach ($topics as $topicData) {
            Log::info($topicData['id']);
            $data = [
                'title' => $topicData['title'] ?? '',
                'description' => $topicData['description'] ?? '',
                'color' => $topicData['color'] ?? '#000000',
                'parent_id' => $parentId,
                'content_id' => $projectId,
                'video' => $topicData['video'] ?? null,
            ];
            // ✅ Handle topic image (expecting it as a base64 or existing string path)
            if (isset($topicData['image_path']) && $topicData['image_path'] instanceof \Illuminate\Http\UploadedFile) {
                $imagePath = $topicData['image_path']->store('projects/topics', 'public');
                $data['image_path'] = $imagePath;
            }

            // ✅ Save topic
            $topic = \App\Models\Topics::findOrNew($topicData['id'] ?? null);
            Log::info($topic);
            $topic->fill(
                $data
            );
            $topic->save();

            // ✅ Recursive save of children
            if (! empty($topicData['topics']) && is_array($topicData['topics'])) {
                $this->saveTopicsRecursive($topicData['topics'], $topic->id, $projectId);
            }
        }
    }

    public function edit_save(Request $request)
    {
        try {
            // Validate the input
            \Log::info($request->all());
            if (! empty($request['group'])) {
                foreach ($request['group'] as $index => $g) {

                    if ($request->hasFile('group.'.$index.'.image')) {
                        $path = $request->file('group.'.$index.'.image')->store('project-images', 'public');
                        $g['image_path'] = $path;
                    } else {

                        \Log::error('No File');
                    }
                    // Update or create project
                    $project = Project::updateOrCreate(

                        ['id' => $g['id'] ?? null], // Check if ID exists
                        [
                            'title' => $g['title'],
                            'description' => $g['description'] ?? null,
                            'video' => $g['video'] ?? null,
                            'image_path' => $g['image_path'] ?? $g['image_path'] ?? null,
                        ]
                    );

                    // Handle questions
                    if (! empty($g['questions'])) {
                        $existingQuestionIds = [];

                        foreach ($g['questions'] as $q) {
                            // Update or create question
                            $question = $project->questions()->updateOrCreate(
                                ['id' => $q['id'] ?? null],
                                ['question' => $q['question']]
                            );

                            $existingQuestionIds[] = $question->id;

                            // Handle answers
                            if (! empty($q['answers'])) {
                                $existingAnswerIds = [];
                                foreach ($q['answers'] as $answer) {
                                    $answerObj = Answer::updateOrCreate(
                                        ['id' => $answer['id'] ?? null],
                                        [
                                            'text' => $answer['text'],
                                            'question_id' => $question->id,
                                            'is_correct' => $answer['is_correct'] ?? false,
                                        ]
                                    );

                                    $existingAnswerIds[] = $answerObj->id;
                                }

                                // Delete answers that were removed
                                if (! empty($q['id'])) {
                                    Answer::where('question_id', $question->id)
                                        ->whereNotIn('id', $existingAnswerIds)
                                        ->delete();
                                }
                            }
                        }

                        // Delete questions that were removed
                        if ($project->exists) {
                            $project->questions()
                                ->whereNotIn('id', $existingQuestionIds)
                                ->delete();
                        }
                    } else {
                        // If no questions provided, delete all existing questions
                        $project->questions()->delete();
                    }
                }
            }

            return redirect()->route('dashboard')->with('success', 'Project updated successfully!');
        } catch (Exception $e) {
            Log::error('Project update failed: '.$e->getMessage());

            return redirect()->back()->withErrors(['error' => 'Something went wrong.']);
        }
    }
}
