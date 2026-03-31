<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\UserBranchPermission;
use App\Models\Permission;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }


        // إذا المستخدم Admin → تجاوز كل الصلاحيات
        if ($user->role === 'admin') {
            return $next($request);
        }

        // إذا المستخدم Staff → لازم نفحص الصلاحيات
        if ($user->role === 'staff') {
            $branchId = $request->branch_id ?? $request->input('branch_id');

            if (!$branchId) {
                return response()->json(['message' => 'branch_id is required'], 400);
            }

            $hasPermission = UserBranchPermission::where('user_id', $user->id)
                ->where('branch_id', $branchId)
                ->whereHas('permission', function ($q) use ($permission) {
                    $q->where('name', $permission);
                })
                ->exists();

            if (!$hasPermission) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // إذا الدور غير admin أو staff → رفض
        else {
            return response()->json(['message' => 'Unauthorized role'], 403);
        }

        return $next($request);
    }
}
