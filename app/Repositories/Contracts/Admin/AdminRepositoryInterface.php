<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface AdminRepositoryInterface
{
    /**
     * Paginate administrators, optionally filtered by a name/email search term.
     *
     * @param  array{search?: string|null, per_page?: int|string|null}  $filters
     */
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function findById(int $id): ?User;

    /**
     * @param  array{name: string, email: string, password: string, is_admin: bool}  $data
     */
    public function create(array $data): User;

    public function update(User $admin, array $data): User;

    public function delete(User $admin): bool;

    public function countAdmins(): int;
}
