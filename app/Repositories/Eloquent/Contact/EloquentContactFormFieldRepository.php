<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactFormField;
use App\Repositories\Contracts\Contact\ContactFormFieldRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactFormFieldRepository implements ContactFormFieldRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactFormField::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('label', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            })
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllActive(): iterable
    {
        return ContactFormField::query()
            ->active()
            ->ordered()
            ->get();
    }

    public function findById(int $id): ?ContactFormField
    {
        return ContactFormField::find($id);
    }

    public function create(array $data): ContactFormField
    {
        return ContactFormField::create($data);
    }

    public function update(ContactFormField $field, array $data): ContactFormField
    {
        $field->update($data);

        return $field;
    }

    public function delete(ContactFormField $field): bool
    {
        return (bool) $field->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactFormField::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactFormField $field): bool
    {
        $field->update(['is_active' => ! $field->is_active]);

        return (bool) $field->is_active;
    }
}
