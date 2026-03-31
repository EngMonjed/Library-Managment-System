<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrower extends Model
{
    protected $fillable = ['name', 'email', 'type', 'phone', 'address'];

    public function borrowings()
    {
        return $this->hasMany(Borrowing::class);
    }
}
