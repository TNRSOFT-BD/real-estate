<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Admin;

use App\Models\User;
use App\Repositories\Contracts\Admin\AdminRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentAdminRepository implements AdminRepositoryInterface
{
    /**
     * Columns that are safe to expose for administrator records.
     *
     * @var list<string>
     */
    private const COLUMNS = ['id', 'name', 'email', 'is_admin', 'created_at', 'updated_at'];

    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $perPage = in_array($perPage, [10, 20, 50], true) ? $perPage : 20;
        $search = trim((string) ($filters['search'] ?? ''));

        return User::query()
            ->where('is_admin', true)
            ->select(self::COLUMNS)
            ->when($search !== '', function ($query) use ($search): void {
                $term = '%'.$search.'%';

                $query->where(function ($query) use ($term): void {
                    $query->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term);
                });
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?User
    {
        return User::query()
            ->where('is_admin', true)
            ->find($id, self::COLUMNS);
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function update(User $admin, array $data): User
    {
        $admin->update($data);

        return $admin;
    }

    public function delete(User $admin): bool
    {
        return (bool) $admin->delete();
    }

    public function countAdmins(): int
    {
        return User::query()->where('is_admin', true)->count();
    }
}
