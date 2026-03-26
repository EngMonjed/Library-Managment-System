<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{


    protected $fillable = [
        'title',
        'publisher_id',
        'isbn',
        'publication_year',
        'description'
    ];

    public function authors()
    {
        return $this->belongsToMany(Author::class, 'book_authors');
    }
    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }
}
