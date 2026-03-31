<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublisherController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookAuthorController;
use App\Http\Controllers\UserPermissionController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;

// Login
Route::post('/login', [AuthController::class, 'login']);
// Protected routes
Route::post('/register', [AuthController::class, 'register'])
    ->middleware([
        'auth:sanctum',
        \App\Http\Middleware\RoleMiddleware::class . ':admin'
    ]);
//permission assignment route, only accessible by admin users
Route::middleware(['auth:sanctum', 'role:admin'])
    ->post('/users/{user}/permissions', [UserPermissionController::class, 'assign']);

// Route to get user permissions, accessible by authenticated users
Route::get('/users/{user}/permissions', [UserPermissionController::class, 'getUserPermissions']);

// Route to remove a permission from a user, only accessible by admin users
Route::delete('/users/{user}/permissions/{permission}', [UserPermissionController::class, 'removePermission']);

// Route to update a user's permission, only accessible by admin users
Route::put('/users/{user}/permissions/{permission}', [UserPermissionController::class, 'updatePermission']);

// Route to update a user's permission, only accessible by admin users
Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('/profile', [AuthController::class, 'profile']);
    // Refresh token
    Route::post('/refresh', [AuthController::class, 'refresh']);
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
// crud routes for authors
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);
Route::post('/authors', [AuthorController::class, 'store']);
// crud routes for publishers and books, protected by auth middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('publishers', PublisherController::class);
});
// Attach authors to a book
Route::post('/books/{book}/authors', [BookAuthorController::class, 'attachAuthors']);
// Detach one author from a book
Route::delete('/books/{book}/authors/{author}', [BookAuthorController::class, 'detachAuthor']);

// Get authors of a book
Route::get('/books/{book}/authors', [BookAuthorController::class, 'getAuthorsOfBook']);

// Get books of an author
Route::get('/authors/{author}/books', [BookAuthorController::class, 'getBooksOfAuthor']);

// Sync authors of a book
Route::put('/books/{book}/authors/sync', [BookAuthorController::class, 'syncAuthors']);

// Search for books, protected by permission middleware
Route::get('/books/search', [BookController::class, 'search'])
    ->middleware('permission:view_books');

// CRUD routes for books, protected by permission middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books/search', [BookController::class, 'search'])
        ->middleware('permission:view_books');
});


// Example of a protected route with permission middleware
Route::get('/books', [BookController::class, 'index'])
    ->middleware('permission:view_books');

// Example of a protected route with permission middleware for editing books
Route::put('/books/{id}', [BookController::class, 'update'])
    ->middleware('permission:edit_books');

// Example of a protected route with permission middleware for deleting books
Route::delete('/books/{id}', [BookController::class, 'destroy'])
    ->middleware('permission:delete_books');
//borrowing routes
Route::post('/borrowings', [BorrowingController::class, 'store']); // إنشاء استعارة
Route::put('/borrowings/items/{id}/return', [BorrowingController::class, 'returnItem']); // إرجاع نسخة
Route::get('/borrowers/{id}/borrowings', [BorrowingController::class, 'getBorrowingsByBorrower']); // عرض استعارات مستعير

// Additional borrowing routes for listing and showing borrowings
Route::get('/borrowings', [BorrowingController::class, 'index']);
Route::get('/borrowings/{id}', [BorrowingController::class, 'show']);
Route::put('/borrowings/{id}', [BorrowingController::class, 'update']);
Route::delete('/borrowings/{id}', [BorrowingController::class, 'destroy']);
