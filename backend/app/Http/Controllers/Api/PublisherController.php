<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publisher;
use Illuminate\Http\Request;

class PublisherController extends Controller
{
    // GET /api/publishers
    public function index()
    {
        return Publisher::withCount('books')->get();
    }

    // POST /api/publishers
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $publisher = Publisher::create($data);

        return response()->json($publisher, 201);
    }

    // GET /api/publishers/{id}
    public function show(Publisher $publisher)
    {
        return $publisher;
    }

    // PUT /api/publishers/{id}
    public function update(Request $request, Publisher $publisher)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $publisher->update($data);

        return $publisher;
    }

    // DELETE /api/publishers/{id}
    public function destroy(Publisher $publisher)
    {
        $publisher->delete();

        return response()->json(null, 204);
    }
}
