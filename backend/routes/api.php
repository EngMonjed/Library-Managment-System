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
use App\Http\Controllers\BranchController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;


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
Route::put('/authors/{author}', [AuthorController::class, 'update']);
Route::delete('/authors/{author}', [AuthorController::class, 'destroy']);
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

// Books routes: auth first, then permission check
Route::middleware(['auth:sanctum', 'permission:manage_books'])->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/search', [BookController::class, 'search']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});
//borrowing routes
Route::post('/borrowings', [BorrowingController::class, 'store']); // إنشاء استعارة
Route::put('/borrowings/items/{id}/return', [BorrowingController::class, 'returnItem']); // إرجاع نسخة
Route::get('/borrowers/{id}/borrowings', [BorrowingController::class, 'getBorrowingsByBorrower']); // عرض استعارات مستعير

// Additional borrowing routes for listing and showing borrowings
Route::get('/borrowings', [BorrowingController::class, 'index']);
Route::get('/borrowings/{id}', [BorrowingController::class, 'show']);
Route::put('/borrowings/{id}', [BorrowingController::class, 'update']);
Route::delete('/borrowings/{id}', [BorrowingController::class, 'destroy']);

// Branch routes
Route::get('/branches', [BranchController::class, 'index']);
Route::post('/branches', [BranchController::class, 'store']);
Route::get('/branches/{id}', [BranchController::class, 'show']);
Route::put('/branches/{id}', [BranchController::class, 'update']);
Route::delete('/branches/{id}', [BranchController::class, 'destroy']);

// Fine routes
Route::get('/fines', [FineController::class, 'index']);
Route::post('/fines', [FineController::class, 'store']);
Route::get('/fines/{id}', [FineController::class, 'show']);
Route::put('/fines/{id}', [FineController::class, 'update']);
Route::delete('/fines/{id}', [FineController::class, 'destroy']);

// Category routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Sub-category routes
Route::get('/sub-categories', [SubCategoryController::class, 'index']);
Route::post('/sub-categories', [SubCategoryController::class, 'store']);
Route::get('/sub-categories/{id}', [SubCategoryController::class, 'show']);
Route::put('/sub-categories/{id}', [SubCategoryController::class, 'update']);
Route::delete('/sub-categories/{id}', [SubCategoryController::class, 'destroy']);


// Handle CORS preflight requests for all routes
Route::options('{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');
