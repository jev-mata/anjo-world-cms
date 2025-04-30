<?php

namespace App\Http\Controllers;

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
        $project = Project::with('questions.answers')->findOrFail($id); // eager load relations
        return Inertia::render('CMS/Show', [
            'project' => $project,
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
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('project-images', 'public');
                $request['image_path'] = $path;
            }

            $group = GroupContents::create();
            if (!empty($request['group'])) {
                foreach ($request['group'] as $q) {
                    // Create project
                    $project = Project::create([
                        'group_contents_id' => $group->id,
                        'title' => $q['title'],
                        'description' => $q['description'] ?? null,
                        'video' => $q['video'] ?? null,
                        'image_path' => $q['image_path'] ?? null,
                    ]); 

                    // Create questions and answers
                    if (!empty($request['questions'])) {
                        foreach ($request['questions'] as $q) {
                            \Log::info($q);
                            $question = $project->questions()->create([
                                'question' => $q['question'],
                            ]);

                            foreach ($q['choices'] as $answer) {
                                $question->answers()->create([
                                    'text' => $answer['text'],
                                    'is_correct' => $answer['is_correct'] ?? false,
                                ]);
                            }

                        }
                    }
                }
            }

            return redirect()->back()->with('success', 'Project created successfully!');
        } catch (Exception $e) {
            Log::error('Project creation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Something went wrong.']);
        }
    }
    public function edit_save(Request $request)
    {
        try {
            // Validate the input
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'video' => 'nullable|url',
                'image' => 'nullable|image|max:2048',
                'questions' => 'nullable|array',
                'questions.*.question' => 'required|string',
                'questions.*.choices' => 'required|array',
                'questions.*.choices.*.text' => 'required|string',
            ]);

            // Find the project to edit
            $project = Project::findOrFail($request->id);

            // Update project fields
            $project->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'video' => $validated['video'] ?? null,
            ]);

            // Store image if provided
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('project-images', 'public');
                $project->image_path = $path;
            }

            // Update or create questions and answers
            if (!empty($validated['questions'])) {
                foreach ($validated['questions'] as $q) {
                    $question = $project->questions()->updateOrCreate(
                        ['question' => $q['question']], // Match question by title or create new
                        ['question' => $q['question']]  // Ensure question is updated
                    );

                    foreach ($q['choices'] as $answer) {
                        $question->answers()->updateOrCreate(
                            ['text' => $answer['text']], // Match answer by text
                            ['text' => $answer['text'], 'is_correct' => $answer['is_correct'] ?? false]
                        );
                    }
                }
            }

            return redirect()->route('projects.edit.save', $project->id)->with('success', 'Project updated successfully!');
        } catch (Exception $e) {
            Log::error('Project update failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Something went wrong.']);
        }
    }

}
