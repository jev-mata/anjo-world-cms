<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
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
        parent::report($e);
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Catch database-related or model not found
        if ($e instanceof ModelNotFoundException || $e instanceof QueryException) {
            return Inertia::render('404')
                ->toResponse($request)
                ->setStatusCode(404);
        }

        // Catch normal 404 route/page not found
        if ($e instanceof NotFoundHttpException) {
            return Inertia::render('404')
                ->toResponse($request)
                ->setStatusCode(404);
        }

        // Fallback: use default Laravel behavior for other errors
        return parent::render($request, $e);
    }
}
