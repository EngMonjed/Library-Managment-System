<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        return Author::withCount('books')->get();
    }
    public function show(Author $author)
    {
        return $author;
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'birth_year' => 'nullable|string',
            'death_year' => 'nullable|string'
        ]);

        $author = Author::create($data);

        return response()->json($author, 201);
    }

    public function update(Request $request, Author $author)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'bio'        => 'nullable|string',
            'birth_year' => 'nullable|string',
            'death_year' => 'nullable|string',
        ]);

        $author->update($data);

        return response()->json($author);
    }

    public function destroy(Author $author)
    {
        $author->delete();

        return response()->json(['message' => 'Author deleted successfully']);
    }
}
