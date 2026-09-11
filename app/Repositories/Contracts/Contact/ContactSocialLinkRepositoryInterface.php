<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactSocialLink;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactSocialLinkRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getAllActive(): iterable;

    public function findById(int $id): ?ContactSocialLink;

    public function create(array $data): ContactSocialLink;

    public function update(ContactSocialLink $link, array $data): ContactSocialLink;

    public function delete(ContactSocialLink $link): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactSocialLink $link): bool;
}
