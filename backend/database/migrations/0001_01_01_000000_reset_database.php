<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Personal Access Tokens
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        // Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'staff'])->default('staff');
            $table->string('password');
            $table->timestamps();
        });

        // Sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
        // Permissions
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Branches
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('city', 100)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // Authors
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
            $table->string('birth_year', 10)->nullable();
            $table->string('death_year', 10)->nullable();
        });

        // Publishers
        Schema::create('publishers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        // Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        // Sub Categories
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable();
            $table->timestamps();
        });

        // Tags
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->timestamps();
        });

        // Books
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->foreignId('publisher_id')->nullable()->constrained()->onDelete('set null');
            $table->string('isbn', 50)->nullable();
            $table->integer('publication_year')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Book Authors (Pivot)
        Schema::create('book_authors', function (Blueprint $table) {
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('author_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->primary(['book_id', 'author_id']);
        });

        // Books Categories (Pivot)
        Schema::create('books_categories', function (Blueprint $table) {
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('sub_category_id')->constrained('sub_categories')->onDelete('cascade');
            $table->string('field')->nullable();
            $table->timestamps();
            $table->primary(['book_id', 'sub_category_id']);
        });

        // Book Tags (Pivot)
        Schema::create('book_tags', function (Blueprint $table) {
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->primary(['book_id', 'tag_id']);
        });

        // Borrowers
        Schema::create('borrowers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('type', 50)->nullable();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // Book Copies
        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('set null');
            $table->string('barcode', 100)->unique();
            $table->enum('status', ['available', 'borrowed', 'lost', 'maintenance'])->default('available');
            $table->timestamps();
        });

        // Borrowings
        Schema::create('borrowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrower_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('set null');
            $table->date('borrow_date')->nullable();
            $table->date('due_date')->nullable();
            $table->string('status', 50)->nullable();
            $table->enum('type', ['external', 'internal'])->default('external');
            $table->timestamps();
        });

        // Borrowing Items
        Schema::create('borrowing_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrowing_id')->constrained()->onDelete('cascade');
            $table->foreignId('copy_id')->constrained('book_copies')->onDelete('cascade');
            $table->date('return_date')->nullable();
            $table->enum('status', ['borrowed', 'returned', 'late'])->default('borrowed');
            $table->timestamps();
            $table->unique(['borrowing_id', 'copy_id']);
        });

        // Fines
        Schema::create('fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrowing_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('borrowing_item_id')->nullable()->constrained('borrowing_items')->onDelete('set null');
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->string('status', 50)->nullable();
            $table->timestamps();
        });

        // Fine Details
        Schema::create('fine_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fine_id')->nullable()->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
        });

        // Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('rating')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // User Branch Permissions
        Schema::create('user_branch_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Activity Log
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action')->nullable();
            $table->string('entity_type', 100)->nullable();
            $table->integer('entity_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('activity_log');
        Schema::dropIfExists('user_branch_permission');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('fine_details');
        Schema::dropIfExists('fines');
        Schema::dropIfExists('borrowing_items');
        Schema::dropIfExists('borrowings');
        Schema::dropIfExists('book_copies');
        Schema::dropIfExists('borrowers');
        Schema::dropIfExists('book_tags');
        Schema::dropIfExists('books_categories');
        Schema::dropIfExists('book_authors');
        Schema::dropIfExists('books');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('sub_categories');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('publishers');
        Schema::dropIfExists('authors');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('users');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::enableForeignKeyConstraints();
    }
};
