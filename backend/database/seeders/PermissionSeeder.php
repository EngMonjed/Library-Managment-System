<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            ['name' => 'view_books', 'description' => 'عرض الكتب'],
            ['name' => 'add_books', 'description' => 'إضافة كتاب'],
            ['name' => 'edit_books', 'description' => 'تعديل كتاب'],
            ['name' => 'delete_books', 'description' => 'حذف كتاب'],

            ['name' => 'view_borrowings', 'description' => 'عرض عمليات الاستعارة'],
            ['name' => 'add_borrowings', 'description' => 'إضافة استعارة'],
            ['name' => 'edit_borrowings', 'description' => 'تعديل استعارة'],
            ['name' => 'delete_borrowings', 'description' => 'حذف استعارة'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
