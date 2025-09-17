<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Models\GroupContents;
use App\Models\Project;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/dashboard');
}); 
Route::get('/dashboard', function () {
    $projects = GroupContents::all();
     
    return inertia('Dashboard', [
        'groupcontents' => $projects,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/pages/view/{project}', [ProjectController::class, 'show'])->name('projects.show');
    
require __DIR__.'/auth.php';
