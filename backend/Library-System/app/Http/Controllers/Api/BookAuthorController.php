<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Author;
use Illuminate\Http\Request;

class BookAuthorController extends Controller
{
    // Attach authors to a book
    public function attachAuthors(Request $request, Book $book)
    {
        $data = $request->validate([
            'author_ids' => 'required|array',
            'author_ids.*' => 'exists:authors,id'
        ]);

        $book->authors()->attach($data['author_ids']);

        return response()->json(['message' => 'Authors attached successfully']);
    }

    // Detach a single author from a book
    public function detachAuthor(Book $book, Author $author)
    {
        $book->authors()->detach($author->id);

        return response()->json(['message' => 'Author detached successfully']);
    }
}
