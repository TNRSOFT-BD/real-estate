<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Legal;

use App\Models\Legal\LegalPage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface LegalPageRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function findById(int $id): ?LegalPage;

    public function allPublished(): Collection;

    public function create(array $data): LegalPage;

    public function update(LegalPage $page, array $data): LegalPage;

    public function delete(LegalPage $page): bool;
}
