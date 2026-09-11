<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactFaq;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactFaqRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getActiveForLocation(string $location): iterable;

    public function findById(int $id): ?ContactFaq;

    public function create(array $data): ContactFaq;

    public function update(ContactFaq $faq, array $data): ContactFaq;

    public function delete(ContactFaq $faq): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactFaq $faq): bool;
}
