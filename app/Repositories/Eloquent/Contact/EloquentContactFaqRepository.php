<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactFaq;
use App\Repositories\Contracts\Contact\ContactFaqRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactFaqRepository implements ContactFaqRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactFaq::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($filters['display_location'] ?? null, fn ($query, $location) => $query->where('display_location', $location))
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getActiveForLocation(string $location): iterable
    {
        return ContactFaq::query()
            ->active()
            ->where(function ($query) use ($location) {
                $query->where('display_location', 'all')
                    ->orWhere('display_location', $location);
            })
            ->ordered()
            ->get(['id', 'question', 'answer', 'category']);
    }

    public function findById(int $id): ?ContactFaq
    {
        return ContactFaq::find($id);
    }

    public function create(array $data): ContactFaq
    {
        return ContactFaq::create($data);
    }

    public function update(ContactFaq $faq, array $data): ContactFaq
    {
        $faq->update($data);

        return $faq;
    }

    public function delete(ContactFaq $faq): bool
    {
        return (bool) $faq->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactFaq::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactFaq $faq): bool
    {
        $faq->update(['is_active' => ! $faq->is_active]);

        return (bool) $faq->is_active;
    }
}
