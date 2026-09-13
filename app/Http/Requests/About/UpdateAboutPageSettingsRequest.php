<?php

declare(strict_types=1);

namespace App\Http\Requests\About;

use App\Rules\SafeLink;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;

class UpdateAboutPageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('about.settings.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_highlight' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string', 'max:2000'],
            'hero_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:4096'],
            'hero_cta_text' => ['nullable', 'string', 'max:100'],
            'hero_cta_link' => ['nullable', 'string', 'max:500', new SafeLink()],

            'intro_badge' => ['nullable', 'string', 'max:100'],
            'intro_title' => ['nullable', 'string', 'max:255'],
            'intro_description' => ['nullable', 'string', 'max:3000'],
            'intro_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:4096'],

            'direction_badge' => ['nullable', 'string', 'max:100'],

            'values_badge' => ['nullable', 'string', 'max:100'],
            'values_title' => ['nullable', 'string', 'max:255'],

            'journey_badge' => ['nullable', 'string', 'max:100'],
            'journey_title' => ['nullable', 'string', 'max:255'],

            'why_badge' => ['nullable', 'string', 'max:100'],
            'why_title' => ['nullable', 'string', 'max:255'],

            'team_badge' => ['nullable', 'string', 'max:100'],
            'team_title' => ['nullable', 'string', 'max:255'],
            'team_description' => ['nullable', 'string', 'max:1000'],

            'partners_title' => ['nullable', 'string', 'max:100'],

            'closing_badge' => ['nullable', 'string', 'max:100'],
            'closing_title' => ['nullable', 'string', 'max:255'],
            'closing_description' => ['nullable', 'string', 'max:2000'],
            'closing_button_text' => ['nullable', 'string', 'max:100'],
            'closing_button_link' => ['nullable', 'string', 'max:500', new SafeLink()],

            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_title' => ['nullable', 'string', 'max:100'],
            'og_description' => ['nullable', 'string', 'max:300'],
            'og_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:4096'],
            'twitter_card' => ['nullable', 'string', 'in:summary,summary_large_image,app,player', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * PHP rejects uploads that exceed `upload_max_filesize` before validation
     * runs, which Laravel then reports as "must be an image". Replace that with
     * the actual cause so oversized uploads are understandable.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $labels = [
                'hero_image' => 'hero image',
                'intro_image' => 'intro image',
                'og_image' => 'Open Graph image',
            ];

            foreach ($labels as $field => $label) {
                $file = $this->file($field);

                if (! $file instanceof UploadedFile) {
                    continue;
                }

                if (! in_array($file->getError(), [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
                    continue;
                }

                $validator->errors()->forget($field);
                $validator->errors()->add($field, sprintf(
                    'The %s is larger than this server accepts (%s). Increase PHP upload_max_filesize / post_max_size or choose a smaller file.',
                    $label,
                    ini_get('upload_max_filesize') ?: 'unknown',
                ));
            }
        });
    }
}