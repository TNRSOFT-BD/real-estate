<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactLocation;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactLocationRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getAllActive(): iterable;

    public function findById(int $id): ?ContactLocation;

    public function getPrimary(): ?ContactLocation;

    public function create(array $data): ContactLocation;

    public function update(ContactLocation $location, array $data): ContactLocation;

    public function delete(ContactLocation $location): bool;

    public function setPrimary(ContactLocation $location): void;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactLocation $location): bool;
}
