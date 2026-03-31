<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BorrowingItem extends Model
{
    protected $fillable = ['borrowing_id', 'copy_id', 'return_date', 'status'];

    public function borrowing()
    {
        return $this->belongsTo(Borrowing::class);
    }
}
