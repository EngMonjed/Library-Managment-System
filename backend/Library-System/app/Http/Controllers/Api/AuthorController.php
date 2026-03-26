<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        return Author::all();
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
}
