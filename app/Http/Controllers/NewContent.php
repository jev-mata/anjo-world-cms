<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewContent extends Controller
{
    //
    public function store(Request $request){
        // Validate and store data
        $validated = $request->validate([
            'title' => 'required|string',
        ]);

        // Example: save to database
        $groupcontent = \App\Models\GroupContents::create($validated);

        $groupcontents = $this->dashbord();

        return response()->json([
            'message' => 'Data submitted successfully!',
            'data' => $validated,
            'groupcontent' => $groupcontent,
            'groupcontents' => $groupcontents,
        ], 201);
    }
    
    public function delete(Request $request){

        $validated = $request->validate([
            'id' => 'required',
        ]);

        // Example: save to database
        $groupContent = \App\Models\GroupContents::find($validated['id']);
        $groupContent->delete();
        $groupcontents = $this->dashbord();

        return response()->json([
            'message' => 'Data deleted successfully!',
            'groupcontents' => $groupcontents,
            'data' => $validated,
        ], 201);
    }
}
