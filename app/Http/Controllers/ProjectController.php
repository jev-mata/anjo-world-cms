<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\GroupContents;
use App\Models\Project;
use App\Models\Question;
use App\Services\AnalyticsService;
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
        $project = GroupContents::with('projects.topics.questions.answers')->findOrFail($id); // eager load relations

        AnalyticsService::recordPageView($id); 

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
        $project = GroupContents::with(['projects.topics.questions.answers'])->findOrFail($id); // eager load relations
        // Log::info($project->with(['projects.topics.questions.answers'])->first());

        return response()->json($project);
    }
    public function store(Request $request)
    {
        \Log::info('Received request data:', $request->all());
        
        // Validate the main structure
        $request->validate([
            'tabs' => 'required|array',
            'tabs.*.title' => 'required|string|max:255',
            'tabs.*.group_contents_id' => 'required|exists:group_contents,id',
            'tabs.*.image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        $responseData = [];
    
        // Process each tab
        foreach ($request->tabs as $tabIndex => $tabData) {
            \Log::info("Processing tab {$tabIndex}:", $tabData);
            
            // Validate individual tab data
            $validatedTab = validator($tabData, [
                'group_contents_id' => 'required',
                'title' => 'required|string|max:255',
                'id' => 'nullable', // Make id nullable for new records
                'description' => 'required|string',
                'color' => 'nullable|string',
                'video' => 'nullable|string',
                'tab_title' => 'nullable|string|max:255',
                'image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
                'topics' => 'nullable|array',
                'removed_topics' => 'nullable|string',
                'removed_questions' => 'nullable|string',
                'removed_answers' => 'nullable|string',
            ])->validate();
    
            // Build update data
            $data = [
                'title' => $validatedTab['title'],
                'description' => $validatedTab['description'],
                'color' => $validatedTab['color'],
                'tab_title' => $validatedTab['tab_title'] ?? $validatedTab['title'],
                'group_contents_id' => $validatedTab['group_contents_id'],
                'video' => $validatedTab['video'] ?? null,
            ];
    
            // Handle image upload
            if ($request->hasFile("tabs.{$tabIndex}.image")) {
                $imagePath = $request->file("tabs.{$tabIndex}.image")->store('projects', 'public');
                $data['image_path'] = $imagePath;
            }
    
            // Handle removed items
            if (!empty($validatedTab['removed_topics'])) {
                $ids = json_decode($validatedTab['removed_topics'], true);
                if (is_array($ids)) {
                    \App\Models\Topics::whereIn('id', $ids)->delete();
                }
            }
    
            // Save project
            $project = Project::updateOrCreate(
                ['id' => $validatedTab['id'] ?? null],
                $data
            );
    
            \Log::info("Saved project: " . $project->id);
    
            // Save topics recursively
            if (!empty($validatedTab['topics'])) {
                $this->saveTopicsRecursive($validatedTab['topics'], null, $project->id);
            }
    
            $responseData[] = $project->load('topics');
        }
    
        return response()->json([
            'message' => 'All tabs saved successfully!',
            'data' => $responseData,
        ], 201);
    }
    
    protected function saveTopicsRecursive(array $topics, $parentId, $projectId)
    {
        foreach ($topics as $topicIndex => $topicData) {
            \Log::info("Processing topic: " . ($topicData['title'] ?? 'Unknown'));
            
            $data = [
                'title' => $topicData['title'] ?? '',
                'description' => $topicData['description'] ?? '',
                'color' => $topicData['color'] ?? '#000000',
                'parent_id' => $parentId,
                'content_id' => $projectId,
                'video' => $topicData['video'] ?? null,
            ];
    
            // Handle topic image
            if (isset($topicData['image']) && $topicData['image'] instanceof \Illuminate\Http\UploadedFile) {
                $imagePath = $topicData['image']->store('projects/topics', 'public');
                $data['image_path'] = $imagePath;
            } elseif (isset($topicData['image_path'])) {
                $data['image_path'] = $topicData['image_path'];
            }
    
            // Save topic
            $topic = \App\Models\Topics::updateOrCreate(
                ['id' => $topicData['id'] ?? null],
                $data
            );
    
            \Log::info("Saved topic: " . $topic->id);
    
            // Save questions
            if (!empty($topicData['questions'])) {
                foreach ($topicData['questions'] as $qIndex => $qData) {
                    $question = Question::updateOrCreate(
                        ['id' => $qData['id'] ?? null],
                        [
                            'topic_id' => $topic->id, 
                            'title' => $qData['title'] ?? 'Untitled Question'
                        ]
                    );
    
                    \Log::info("Saved question: " . $question->id);
    
                    // Save answers
                    if (!empty($qData['answers'])) {
                        $answerIds = [];
                        foreach ($qData['answers'] as $aIndex => $aData) {
                            $answer = Answer::updateOrCreate(
                                ['id' => $aData['id'] ?? null],
                                [
                                    'question_id' => $question->id,
                                    'text' => $aData['text'] ?? '',
                                    'is_correct' => $aData['is_correct'] ?? false,
                                ]
                            );
                            $answerIds[] = $answer->id;
                            \Log::info("Saved answer: " . $answer->id);
                        }
    
                        // Cleanup deleted answers
                        Answer::where('question_id', $question->id)
                              ->whereNotIn('id', $answerIds)
                              ->delete();
                    }
                }
            }
    
            // Recursive save of children
            if (!empty($topicData['topics'])) {
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
                            $question = $project->topics()->updateOrCreate(
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
                            $project->topics()
                                ->whereNotIn('id', $existingQuestionIds)
                                ->delete();
                        }
                    } else {
                        // If no questions provided, delete all existing questions
                        $project->topics()->delete();
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
