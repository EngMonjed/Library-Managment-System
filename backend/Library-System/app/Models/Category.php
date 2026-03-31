<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCategory;


class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
    ];
    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }
}
