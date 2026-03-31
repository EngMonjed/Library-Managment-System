<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // GET /api/books
    public function index()
    {
        return Book::with('publisher')->get();
    }

    // POST /api/books
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|max:255',
            'publisher_id'     => 'nullable|integer|exists:publishers,id',
            'isbn'             => 'nullable|string|max:50',
            'publication_year' => 'nullable|integer',
            'description'      => 'nullable|string',
        ]);

        $book = Book::create($data);

        return response()->json($book, 201);
    }

    // GET /api/books/{id}
    public function show(Book $book)
    {
        return $book->load('publisher');
    }

    // PUT /api/books/{id}
    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'title'            => 'sometimes|required|string|max:255',
            'publisher_id'     => 'nullable|integer|exists:publishers,id',
            'isbn'             => 'nullable|string|max:50',
            'publication_year' => 'nullable|integer',
            'description'      => 'nullable|string',
        ]);

        $book->update($data);

        return $book;
    }

    // DELETE /api/books/{id}
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(null, 204);
    }
}
