<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class DatabaseSeeder  extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Users
        for ($i = 1; $i <= 20; $i++) {
            DB::table('users')->insert([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'role' => $i % 5 == 0 ? 'admin' : 'staff',
                'password' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Permissions
        $permissions = ['borrow', 'return', 'manage_books', 'manage_users', 'view_reports'];
        foreach ($permissions as $perm) {
            DB::table('permissions')->insert([
                'name' => $perm,
                'description' => ucfirst($perm) . ' permission',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Branches
        for ($i = 1; $i <= 10; $i++) {
            DB::table('branches')->insert([
                'name' => $faker->company . ' Branch',
                'city' => $faker->city(),
                'address' => $faker->address(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Authors
        for ($i = 1; $i <= 50; $i++) {
            DB::table('authors')->insert([
                'name' => $faker->name(),
                'bio' => $faker->paragraph(),
                'birth_year' => $faker->year(),
                'death_year' => rand(0, 1) ? $faker->year() : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Publishers
        for ($i = 1; $i <= 20; $i++) {
            DB::table('publishers')->insert([
                'name' => $faker->company(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Categories
        for ($i = 1; $i <= 10; $i++) {
            DB::table('categories')->insert([
                'name' => $faker->word(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Sub Categories
        for ($i = 1; $i <= 30; $i++) {
            DB::table('sub_categories')->insert([
                'category_id' => rand(1, 10),
                'name' => $faker->word(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Tags
        for ($i = 1; $i <= 50; $i++) {
            DB::table('tags')->insert([
                'name' => $faker->unique()->word(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Books
        for ($i = 1; $i <= 100; $i++) {
            DB::table('books')->insert([
                'title' => $faker->sentence(3),
                'publisher_id' => rand(1, 20),
                'isbn' => $faker->isbn13(),
                'publication_year' => $faker->year(),
                'description' => $faker->paragraph(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Book Authors
        $used = [];

        for ($i = 1; $i <= 150; $i++) {

            do {
                $book_id = rand(1, 100);
                $author_id = rand(1, 50);
                $key = $book_id . '-' . $author_id;
            } while (isset($used[$key]));

            $used[$key] = true;

            DB::table('book_authors')->insert([
                'book_id' => $book_id,
                'author_id' => $author_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Books Categories
        $used = [];

        for ($i = 1; $i <= 120; $i++) {

            do {
                $book_id = rand(1, 100);
                $sub_category_id = rand(1, 30);
                $key = $book_id . '-' . $sub_category_id;
            } while (isset($used[$key]));

            $used[$key] = true;

            DB::table('books_categories')->insert([
                'book_id' => $book_id,
                'sub_category_id' => $sub_category_id,
                'field' => $faker->word(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Book Tags
        $books = range(1, 100);
        $tags = range(1, 50);

        foreach ($books as $book) {

            // كل كتاب ياخذ 1 إلى 5 tags
            $randomTags = collect($tags)->shuffle()->take(rand(1, 5));

            foreach ($randomTags as $tag) {
                DB::table('book_tags')->insert([
                    'book_id' => $book,
                    'tag_id' => $tag,
                ]);
            }
        }

        // Borrowers
        for ($i = 1; $i <= 50; $i++) {
            DB::table('borrowers')->insert([
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'type' => $i % 2 == 0 ? 'student' : 'teacher',
                'phone' => $faker->phoneNumber(),
                'address' => $faker->address(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Book Copies
        for ($i = 1; $i <= 150; $i++) {
            DB::table('book_copies')->insert([
                'book_id' => rand(1, 100),
                'branch_id' => rand(1, 10),
                'barcode' => 'BC' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'status' => ['available', 'borrowed', 'lost', 'maintenance'][rand(0, 3)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Borrowings
        for ($i = 1; $i <= 100; $i++) {
            DB::table('borrowings')->insert([
                'borrower_id' => rand(1, 50),
                'user_id' => rand(1, 20),
                'branch_id' => rand(1, 10),
                'borrow_date' => $faker->dateTimeThisYear(),
                'due_date' => $faker->dateTimeThisYear(),
                'status' => ['pending', 'completed', 'late'][rand(0, 2)],
                'type' => ['external', 'internal'][rand(0, 1)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Borrowing Items
        $borrowings = range(1, 100);
        $copies = range(1, 150);

        foreach ($borrowings as $borrowing) {

            $randomCopies = collect($copies)->shuffle()->take(rand(1, 3));

            foreach ($randomCopies as $copy) {
                DB::table('borrowing_items')->insert([
                    'borrowing_id' => $borrowing,
                    'copy_id' => $copy,
                    'return_date' => $faker->optional()->dateTimeThisYear(),
                    'status' => ['borrowed', 'returned', 'late'][rand(0, 2)],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Fines
        for ($i = 1; $i <= 50; $i++) {
            DB::table('fines')->insert([
                'borrowing_id' => rand(1, 100),
                'borrowing_item_id' => rand(1, 150),
                'total_amount' => rand(1, 50),
                'status' => ['pending', 'paid'][rand(0, 1)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Fine Details
        for ($i = 1; $i <= 100; $i++) {
            DB::table('fine_details')->insert([
                'fine_id' => rand(1, 50),
                'amount' => rand(1, 50),
                'reason' => $faker->sentence(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Reviews
        for ($i = 1; $i <= 100; $i++) {
            DB::table('reviews')->insert([
                'book_id' => rand(1, 100),
                'rating' => rand(1, 5),
                'comment' => $faker->sentence(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // User Branch Permissions
        for ($i = 1; $i <= 50; $i++) {
            DB::table('user_branch_permission')->insert([
                'user_id' => rand(1, 20),
                'branch_id' => rand(1, 10),
                'permission_id' => rand(1, count($permissions)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Activity Log
        for ($i = 1; $i <= 100; $i++) {
            DB::table('activity_log')->insert([
                'user_id' => rand(1, 20),
                'action' => $faker->word(),
                'entity_type' => 'book',
                'entity_id' => rand(1, 100),
                'created_at' => now(),
            ]);
        }

        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'password' => bcrypt('123456'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        $this->call(DatabaseSeeder::class);
    }
}
