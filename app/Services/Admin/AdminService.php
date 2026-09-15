<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Exceptions\AdminManagementException;
use App\Models\User;
use App\Repositories\Contracts\Admin\AdminRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    public function __construct(
        private readonly AdminRepositoryInterface $repository,
    ) {}

    /**
     * @param  array{name: string, email: string, password: string}  $data
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            return $this->repository->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'is_admin' => true,
            ]);
        });
    }

    /**
     * @param  array{name: string, email: string}  $data
     */
    public function update(User $admin, array $data): User
    {
        return DB::transaction(fn (): User => $this->repository->update($admin, [
            'name' => $data['name'],
            'email' => $data['email'],
        ]));
    }

    /**
     * Change an administrator's password and invalidate their existing sessions.
     */
    public function changePassword(User $admin, string $password): User
    {
        return DB::transaction(function () use ($admin, $password): User {
            $admin = $this->repository->update($admin, [
                'password' => Hash::make($password),
            ]);

            DB::table('sessions')->where('user_id', $admin->getKey())->delete();

            return $admin;
        });
    }

    public function delete(User $admin, User $actor): void
    {
        if ($admin->is($actor)) {
            throw AdminManagementException::cannotDeleteSelf();
        }

        if ($this->repository->countAdmins() <= 1) {
            throw AdminManagementException::cannotDeleteLastAdmin();
        }

        DB::transaction(fn () => $this->repository->delete($admin));
    }
}
