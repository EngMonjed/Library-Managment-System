<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Permission;

class UserBranchPermission extends Model
{
    protected $table = 'user_branch_permission';

    protected $fillable = [
        'user_id',
        'branch_id',
        'permission_id',
    ];

    public function permission()
    {
        return $this->belongsTo(Permission::class, 'permission_id');
    }
    public function getUserPermissions(User $user)
    {
        $permissions = UserBranchPermission::with('permission')
            ->where('user_id', $user->id)
            ->get();

        return response()->json($permissions);
    }
}
