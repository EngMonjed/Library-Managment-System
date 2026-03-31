<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    // عرض كل الكتب
    public function index()
    {
        $books = Book::with(['publisher', 'subCategories.category'])->get();
        return response()->json($books);
    }

    // عرض كتاب واحد
    public function show($id)
    {
        $book = Book::with(['publisher', 'subCategories.category'])->findOrFail($id);
        return response()->json($book);
    }

    // إضافة كتاب جديد
    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    // تحديث كتاب
    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        return response()->json($book);
    }

    // حذف كتاب
    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->json(null, 204);
    }

    // البحث عن الكتب
    public function search(Request $request)
    {
        $query = Book::query();

        if ($search = $request->query('q')) {
            $query->where(function ($q2) use ($search) {
                $q2->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('isbn', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if ($publisher = $request->query('publisher')) {
            $query->whereHas('publisher', function ($q) use ($publisher) {
                $q->where('name', 'LIKE', "%{$publisher}%");
            });
        }

        if ($year = $request->query('year')) {
            $query->where('publication_year', $year);
        }

        if ($categoryId = $request->query('category_id')) {
            $query->whereHas('subCategories.category', function ($q) use ($categoryId) {
                $q->where('id', $categoryId);
            });
        }

        if ($subCategoryId = $request->query('sub_category_id')) {
            $query->whereHas('subCategories', function ($q) use ($subCategoryId) {
                $q->where('id', $subCategoryId);
            });
        }

        $books = $query->with(['publisher', 'subCategories.category'])->get();

        return response()->json($books);
    }
}
