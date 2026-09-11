<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactFormField;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactFormFieldRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getAllActive(): iterable;

    public function findById(int $id): ?ContactFormField;

    public function create(array $data): ContactFormField;

    public function update(ContactFormField $field, array $data): ContactFormField;

    public function delete(ContactFormField $field): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactFormField $field): bool;
}
