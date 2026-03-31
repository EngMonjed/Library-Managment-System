<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Models\FineDetail;
use Illuminate\Http\Request;

class FineController extends Controller
{
    // Get all fines
    public function index()
    {
        return Fine::with('details')->get();
    }

    // Create fine
    public function store(Request $request)
    {
        $request->validate([
            'borrowing_id' => 'required|exists:borrowings,id',
            'borrowing_item_id' => 'nullable|exists:borrowing_items,id',
            'total_amount' => 'required|numeric',
            'status' => 'nullable|string',
            'details' => 'nullable|array',
            'details.*.amount' => 'required_with:details|numeric',
            'details.*.reason' => 'required_with:details|string'
        ]);

        $fine = Fine::create([
            'borrowing_id' => $request->borrowing_id,
            'borrowing_item_id' => $request->borrowing_item_id,
            'total_amount' => $request->total_amount,
            'status' => $request->status ?? 'unpaid'
        ]);

        if ($request->details) {
            foreach ($request->details as $detail) {
                FineDetail::create([
                    'fine_id' => $fine->id,
                    'amount' => $detail['amount'],
                    'reason' => $detail['reason']
                ]);
            }
        }

        return response()->json($fine->load('details'), 201);
    }

    // Show single fine
    public function show($id)
    {
        return Fine::with('details')->findOrFail($id);
    }

    // Update fine
    public function update(Request $request, $id)
    {
        $fine = Fine::findOrFail($id);
        $fine->update($request->only(['total_amount', 'status']));
        return response()->json($fine);
    }

    // Delete fine
    public function destroy($id)
    {
        $fine = Fine::findOrFail($id);
        $fine->delete();
        return response()->json(['message' => 'Fine deleted successfully']);
    }
}
