<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Publisher;
use App\Models\SubCategory;

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
        return $this->belongsTo(Publisher::class, 'publisher_id');
    }

    public function subCategories()
    {
        return $this->belongsToMany(SubCategory::class, 'books_categories', 'book_id', 'sub_category_id');
    }
}
