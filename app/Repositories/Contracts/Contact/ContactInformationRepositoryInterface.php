<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactInformation;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactInformationRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getAllActive(): iterable;

    public function findById(int $id): ?ContactInformation;

    public function create(array $data): ContactInformation;

    public function update(ContactInformation $information, array $data): ContactInformation;

    public function delete(ContactInformation $information): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactInformation $information): bool;
}
