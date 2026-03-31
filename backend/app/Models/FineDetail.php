<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FineDetail extends Model
{
    protected $fillable = [
        'fine_id',
        'amount',
        'reason'
    ];

    public function fine()
    {
        return $this->belongsTo(Fine::class);
    }
}
