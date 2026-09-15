<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Project\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lean public representation of a project used by listing surfaces
 * (projects index, homepage showcase).
 *
 * @mixin Project
 */
class ProjectCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'hero_banner' => $this->hero_banner,
            'hero_banner_alt' => $this->hero_banner_alt,
            'short_description' => $this->short_description,
            'location_area' => $this->location_area,
            'location_city' => $this->location_city,
            'location_country' => $this->location_country,
            'is_featured' => $this->is_featured,
            'type' => $this->type ? [
                'id' => $this->type->id,
                'name' => $this->type->name,
                'slug' => $this->type->slug,
            ] : null,
            'status' => $this->status ? [
                'id' => $this->status->id,
                'name' => $this->status->name,
                'slug' => $this->status->slug,
                'color' => $this->status->color,
            ] : null,
        ];
    }
}
