<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Borrowing;
use App\Models\BorrowingItem;

class BorrowingController extends Controller
{
    // إنشاء عملية استعارة جديدة
    public function store(Request $request)
    {
        $borrowing = Borrowing::create([
            'borrower_id' => $request->borrower_id,
            'user_id'     => $request->user_id,
            'branch_id'   => $request->branch_id,
            'borrow_date' => now(),
            'due_date'    => $request->due_date,
            'status'      => 'active',
            'type'        => $request->type ?? 'external'
        ]);

        foreach ($request->items as $item) {
            BorrowingItem::create([
                'borrowing_id' => $borrowing->id,
                'copy_id'      => $item['copy_id'],
                'status'       => 'borrowed'
            ]);
        }

        return response()->json($borrowing->load('items'), 201);
    }

    // إرجاع نسخة كتاب
    public function returnItem($id)
    {
        $item = BorrowingItem::findOrFail($id);
        $item->update([
            'status' => 'returned',
            'return_date' => now()
        ]);

        return response()->json($item);
    }

    // عرض استعارات مستخدم/مستعير
    public function getBorrowingsByBorrower($borrowerId)
    {
        $borrowings = Borrowing::where('borrower_id', $borrowerId)
            ->with('items')
            ->get();

        return response()->json($borrowings);
    }
    public function index()
    {
        return Borrowing::with('items', 'borrower')->get();
    }

    public function show($id)
    {
        return Borrowing::with('items', 'borrower')->findOrFail($id);
    }
    public function update(Request $request, $id)
    {
        $borrowing = Borrowing::findOrFail($id);
        $borrowing->update($request->only(['due_date', 'status']));
        return response()->json($borrowing);
    }
    public function destroy($id)
    {
        $borrowing = Borrowing::findOrFail($id);
        $borrowing->delete();
        return response()->json(['message' => 'Borrowing deleted successfully']);
    }
}
