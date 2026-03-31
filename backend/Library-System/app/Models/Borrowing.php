<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    protected $fillable = ['borrower_id', 'user_id', 'branch_id', 'borrow_date', 'due_date', 'status', 'type'];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function items()
    {
        return $this->hasMany(BorrowingItem::class);
    }
}
