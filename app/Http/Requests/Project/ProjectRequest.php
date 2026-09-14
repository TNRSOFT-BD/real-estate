<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use App\Rules\GoogleMapsUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class ProjectRequest extends FormRequest
{
    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => [
                'nullable',
                'string',
                'max:200',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug')->ignore($projectId),
            ],
            'project_code' => ['nullable', 'string', 'max:50', Rule::unique('projects', 'project_code')->ignore($projectId)],
            'project_type_id' => ['required', 'integer', 'exists:project_types,id'],
            'project_status_id' => ['required', 'integer', 'exists:project_statuses,id'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'overview' => ['nullable', 'string', 'max:200000'],

            'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],

            'location_address' => ['nullable', 'string', 'max:255'],
            'location_area' => ['nullable', 'string', 'max:255'],
            'location_city' => ['nullable', 'string', 'max:255'],
            'location_country' => ['nullable', 'string', 'max:255'],
            'google_map_url' => ['nullable', 'string', 'max:500', new GoogleMapsUrl],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            'total_land_area' => ['nullable', 'numeric', 'min:0'],
            'total_units' => ['nullable', 'integer', 'min:0'],
            'number_of_floors' => ['nullable', 'integer', 'min:0'],
            'number_of_buildings' => ['nullable', 'integer', 'min:0'],
            'units_per_floor' => ['nullable', 'integer', 'min:0'],
            'handover_date' => ['nullable', 'date'],

            'property_features' => ['nullable', 'array'],
            'property_features.*.key' => ['required_with:property_features', 'string', 'max:100'],
            'property_features.*.value' => ['nullable', 'string', 'max:500'],
            'property_features.*.icon' => ['nullable', 'string', 'max:50'],
            'amenities' => ['nullable', 'array'],
            'amenities.*.name' => ['required_with:amenities', 'string', 'max:100'],
            'amenities.*.icon' => ['nullable', 'string', 'max:50'],

            'hero_banner' => $this->imageRules(),
            'hero_banner_alt' => ['nullable', 'string', 'max:255'],
            'remove_hero_banner' => ['sometimes', 'boolean'],
            'at_a_glance_image' => $this->imageRules(),
            'at_a_glance_image_alt' => ['nullable', 'string', 'max:255'],
            'remove_at_a_glance_image' => ['sometimes', 'boolean'],
            'brochure_pdf' => $this->documentRules(),
            'remove_brochure_pdf' => ['sometimes', 'boolean'],
            'promo_video_url' => ['nullable', 'url', 'max:500'],

            'legal_approval_no' => ['nullable', 'string', 'max:100'],
            'legal_approval_document' => $this->documentRules(),
            'remove_legal_approval_document' => ['sometimes', 'boolean'],

            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'robots' => ['nullable', Rule::in(['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'])],

            'og_title' => ['nullable', 'string', 'max:100'],
            'og_description' => ['nullable', 'string', 'max:300'],
            'og_image' => $this->imageRules(),
            'remove_og_image' => ['sometimes', 'boolean'],

            'twitter_card' => ['nullable', Rule::in(['summary', 'summary_large_image'])],
            'twitter_title' => ['nullable', 'string', 'max:100'],
            'twitter_description' => ['nullable', 'string', 'max:300'],
            'twitter_image' => $this->imageRules(),
            'remove_twitter_image' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $project = $this->route('project');

            $this->ensureSelectable($validator, 'project_type_id', ProjectType::class, $project?->project_type_id);
            $this->ensureSelectable($validator, 'project_status_id', ProjectStatus::class, $project?->project_status_id);

            foreach (['hero_banner', 'at_a_glance_image', 'brochure_pdf', 'legal_approval_document', 'og_image', 'twitter_image'] as $field) {
                $file = $this->file($field);

                if ($file instanceof UploadedFile && ! $file->isValid()) {
                    $validator->errors()->add(
                        $field,
                        'This file could not be uploaded. The server accepts uploads up to '.ini_get('upload_max_filesize').'.',
                    );
                }
            }
        });
    }

    /**
     * @return array<int, mixed>
     */
    private function imageRules(): array
    {
        return [
            'nullable',
            'image',
            'mimes:'.implode(',', (array) config('projects.media.image_mimes')),
            'max:'.(int) config('projects.media.image_max_kb'),
        ];
    }

    /**
     * @return array<int, mixed>
     */
    private function documentRules(): array
    {
        return [
            'nullable',
            'file',
            'mimes:'.implode(',', (array) config('projects.media.document_mimes')),
            'max:'.(int) config('projects.media.document_max_kb'),
        ];
    }

    /**
     * An inactive type/status may stay assigned to an existing project, but a new
     * selection must point at an active record.
     *
     * @param  class-string<Model>  $modelClass
     */
    private function ensureSelectable(Validator $validator, string $field, string $modelClass, ?int $currentId): void
    {
        $selected = $this->input($field);

        if ($selected === null || (int) $selected === (int) $currentId) {
            return;
        }

        $isActive = $modelClass::query()->whereKey($selected)->value('is_active');

        if ($isActive !== null && ! $isActive) {
            $validator->errors()->add($field, 'Select an active option.');
        }
    }
}
