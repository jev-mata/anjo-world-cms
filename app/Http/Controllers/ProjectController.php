<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\GroupContents;
use App\Models\Project;
use App\Models\Question;
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
        $project = GroupContents::with('projects.questions.answers')->findOrFail($id); // eager load relations
        return Inertia::render('CMS/Show', [
            'groupcontent' => $project,
        ]);
    }
    public function edit_show($id)
    {
        $project = Project::with('questions.answers')->findOrFail($id); // eager load relations
        return Inertia::render('CMS/edit', [
            'project' => $project,
        ]);
    }

    public function store(Request $request)
    {
        try {
            \Log::info($request->all());

            // Store image if provided

            $group = GroupContents::create();
            if (!empty($group)) {
                if (!empty($request['group'])) {
                    foreach ($request['group'] as $index => $g) {

                        if ($request->hasFile('group.' . $index . '.image')) {
                            $path = $request->file('group.' . $index . '.image')->store('project-images', 'public');
                            $imagePath = $path;
                            \Log::info('Image uploaded: ' . $imagePath);
                        } elseif (!empty($g['image_path'])) {
                            $imagePath = $g['image_path'];
                        }
                        // Create project
                        $project = Project::create([
                            'group_contents_id' => $group->id,
                            'title' => $g['title'],
                            'description' => $g['description'] ?? null,
                            'video' => $g['video'] ?? null,
                            'image_path' => $g['image_path'] ?? null,
                        ]);

                        // Create questions and answers
                        if (!empty($g['questions'])) {
                            foreach ($g['questions'] as $q) {
                                \Log::info($q);
                                $question = $project->questions()->create([
                                    'question' => $q['question'],
                                ]);
                                if ($question != null) {

                                    foreach ($q['choices'] as $answer) {
                                        $answerOBJ = Answer::create([
                                            'text' => $answer['text'],
                                            'question_id' => $question['id'],
                                            'is_correct' => $answer['is_correct'] ?? false,
                                        ]);
                                        if ($answerOBJ != null) {

                                            \Log::info('choices Added to database');
                                        } else {

                                            \Log::error('choices Not Added to database');
                                        }

                                    }
                                } else {

                                    \Log::error('Question Not Added to database');
                                }

                            }
                        } else {

                        }
                    }
                }
            }


            // return redirect()->back()->with('success', 'Project created successfully!');
        } catch (Exception $e) {
            Log::error('Project creation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Something went wrong.']);
        }
    }
    public function edit_save(Request $request)
    {
        try {
            // Validate the input
            \Log::info($request->all());
            if (!empty($request['group'])) {
                foreach ($request['group'] as $index => $g) {

                    if ($request->hasFile('group.' . $index . '.image')) {
                        $path = $request->file('group.' . $index . '.image')->store('project-images', 'public');
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
                    if (!empty($g['questions'])) {
                        $existingQuestionIds = [];

                        foreach ($g['questions'] as $q) {
                            // Update or create question
                            $question = $project->questions()->updateOrCreate(
                                ['id' => $q['id'] ?? null],
                                ['question' => $q['question']]
                            );

                            $existingQuestionIds[] = $question->id;

                            // Handle answers
                            if (!empty($q['answers'])) {
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
                                if (!empty($q['id'])) {
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
            Log::error('Project update failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Something went wrong.']);
        }
    }

}
