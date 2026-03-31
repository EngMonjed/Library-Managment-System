<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserBranchPermission;
use App\Models\Permission;

class UserPermissionController extends Controller
{
    // إضافة صلاحية
    public function assign(Request $request, $userId)
    {
        $request->validate([
            'branch_id' => 'required|integer',
            'permission_id' => 'required|integer',
        ]);

        UserBranchPermission::create([
            'user_id' => $userId,
            'branch_id' => $request->branch_id,
            'permission_id' => $request->permission_id,
        ]);

        return response()->json(['message' => 'Permission assigned successfully']);
    }

    // جلب صلاحيات المستخدم
    public function getUserPermissions($userId)
    {
        $permissions = UserBranchPermission::with('permission')
            ->where('user_id', $userId)
            ->get();

        return response()->json($permissions);
    }

    // حذف صلاحية
    public function removePermission($userId, $permissionId)
    {
        $deleted = UserBranchPermission::where('user_id', $userId)
            ->where('id', $permissionId)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        return response()->json(['message' => 'Permission removed successfully']);
    }

    // تحديث صلاحية
    public function updatePermission(Request $request, $userId, $permissionId)
    {
        $request->validate([
            'branch_id' => 'required|integer',
            'permission_id' => 'required|integer',
        ]);

        $record = UserBranchPermission::where('user_id', $userId)
            ->where('id', $permissionId)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        $record->update([
            'branch_id' => $request->branch_id,
            'permission_id' => $request->permission_id,
        ]);

        return response()->json(['message' => 'Permission updated successfully']);
    }
}
