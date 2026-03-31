<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{


    protected $fillable = [
        'name',
        'bio',
        'birth_year',
        'death_year'
    ];

    public function books()
    {
        return $this->belongsToMany(Book::class, 'book_authors');
    }
}
