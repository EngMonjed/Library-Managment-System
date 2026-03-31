<?php
namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    // Get all branches
    public function index()
    {
        return Branch::all();
    }

    // Create new branch
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'city' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $branch = Branch::create($request->all());
        return response()->json($branch, 201);
    }

    // Show single branch
    public function show($id)
    {
        return Branch::findOrFail($id);
    }

    // Update branch
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);
        $branch->update($request->all());

        return response()->json($branch);
    }

    // Delete branch
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        return response()->json(['message' => 'Branch deleted successfully']);
    }
}
