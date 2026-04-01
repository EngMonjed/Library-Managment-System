<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    public function index()
    {
        return SubCategory::with('category')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required'
        ]);

        $sub = SubCategory::create($request->all());
        return response()->json($sub, 201);
    }

    public function show($id)
    {
        return SubCategory::with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $sub = SubCategory::findOrFail($id);
        $sub->update($request->all());

        return response()->json($sub);
    }

    public function destroy($id)
    {
        $sub = SubCategory::findOrFail($id);
        $sub->delete();

        return response()->json(['message' => 'Sub-category deleted']);
    }
}
