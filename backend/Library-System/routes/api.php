<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\PublisherController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookAuthorController;

// login/logout routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

// crud routes for authors
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);
Route::post('/authors', [AuthorController::class, 'store']);

// crud routes for publishers and books, protected by auth middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('publishers', PublisherController::class);
    Route::apiResource('books', BookController::class);

    // Attach authors to a book
    Route::post('/books/{book}/authors', [BookAuthorController::class, 'attachAuthors']);
    // Detach one author from a book
    Route::delete('/books/{book}/authors/{author}', [BookAuthorController::class, 'detachAuthor']);
});
