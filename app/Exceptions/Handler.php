<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Report the exception.
     */
    public function report(Throwable $e): void
    {
        Log::error($e); // <- Log everything first
        parent::report($e);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        if ($request->header('X-Inertia')) {
            // For Inertia requests, return Inertia 404
            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return Inertia::render('404')->toResponse($request)->setStatusCode(404);
            }
        } else {
            // For normal requests
            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->view('errors.404', [], 404);
            }
        } 
        // Fallback: use default Laravel behavior for other errors
        return parent::render($request, $e);
    }
}
