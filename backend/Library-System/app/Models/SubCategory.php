<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class SubCategory  extends Model
{
    protected $table = 'sub_categories';

    protected $fillable = [
        'category_id',
        'name',

    ];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
