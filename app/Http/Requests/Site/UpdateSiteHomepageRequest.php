<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Enums\HeroVideoQuality;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteHomepageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('site.theme.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'hero_eyebrow' => ['nullable', 'string', 'max:255'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string', 'max:2000'],
            'hero_video_quality' => ['sometimes', 'string', Rule::in(HeroVideoQuality::values())],
            'hero_video_enabled' => ['sometimes', 'boolean'],
            'hero_video_source' => ['sometimes', 'string', Rule::in(['default', 'upload', 'url'])],
            'hero_video_link' => ['nullable', 'url', 'max:500'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:500'],
        ];
    }
}
