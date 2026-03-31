<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = [
        'borrowing_id',
        'borrowing_item_id',
        'total_amount',
        'status'
    ];

    public function borrowing()
    {
        return $this->belongsTo(Borrowing::class);
    }

    public function borrowingItem()
    {
        return $this->belongsTo(BorrowingItem::class);
    }

    public function details()
    {
        return $this->hasMany(FineDetail::class);
    }
}
