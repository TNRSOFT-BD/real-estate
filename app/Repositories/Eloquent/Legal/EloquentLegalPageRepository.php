<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Legal;

use App\Models\Legal\LegalPage;
use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentLegalPageRepository implements LegalPageRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return LegalPage::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->orderBy('title')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?LegalPage
    {
        return LegalPage::find($id);
    }

    public function allPublished(): Collection
    {
        return LegalPage::query()
            ->published()
            ->orderBy('title')
            ->get();
    }

    public function create(array $data): LegalPage
    {
        return LegalPage::create($data);
    }

    public function update(LegalPage $page, array $data): LegalPage
    {
        $page->update($data);

        return $page;
    }

    public function delete(LegalPage $page): bool
    {
        return (bool) $page->delete();
    }
}
