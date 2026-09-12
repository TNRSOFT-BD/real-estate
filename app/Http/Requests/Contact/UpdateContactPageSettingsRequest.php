<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Rules\SafeLink;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;

class UpdateContactPageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.settings.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_highlight' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string', 'max:1000'],
            'hero_primary_button_text' => ['nullable', 'string', 'max:100'],
            'hero_primary_button_link' => ['nullable', 'string', 'max:500', new SafeLink()],
            'hero_secondary_button_text' => ['nullable', 'string', 'max:100'],
            'hero_secondary_button_link' => ['nullable', 'string', 'max:500', new SafeLink()],
            'hero_background_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'form_title' => ['nullable', 'string', 'max:255'],
            'form_description' => ['nullable', 'string', 'max:1000'],
            'form_success_message' => ['nullable', 'string', 'max:1000'],
            'faq_badge' => ['nullable', 'string', 'max:100'],
            'faq_title' => ['nullable', 'string', 'max:255'],
            'faq_description' => ['nullable', 'string', 'max:1000'],
            'team_badge' => ['nullable', 'string', 'max:100'],
            'team_title' => ['nullable', 'string', 'max:255'],
            'team_description' => ['nullable', 'string', 'max:1000'],
            'location_badge' => ['nullable', 'string', 'max:100'],
            'location_title' => ['nullable', 'string', 'max:255'],
            'location_description' => ['nullable', 'string', 'max:1000'],
            'live_chat_title' => ['nullable', 'string', 'max:255'],
            'live_chat_description' => ['nullable', 'string', 'max:1000'],
            'closing_badge' => ['nullable', 'string', 'max:100'],
            'closing_title' => ['nullable', 'string', 'max:255'],
            'closing_description' => ['nullable', 'string', 'max:1000'],
            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_title' => ['nullable', 'string', 'max:100'],
            'og_description' => ['nullable', 'string', 'max:300'],
            'og_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
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
                'hero_background_image' => 'background image',
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
