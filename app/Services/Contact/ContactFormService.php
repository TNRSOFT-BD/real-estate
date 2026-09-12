<?php

declare(strict_types=1);

namespace App\Services\Contact;

use App\Enums\ContactFormFieldType;
use App\Models\Contact\ContactFormField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ContactFormService
{
    private const WHITELISTED_RULES = [
        'required',
        'nullable',
        'string',
        'email',
        'url',
    ];

    public function normalizeFieldName(string $label): string
    {
        $base = Str::snake(Str::slug($label, '_'));

        if (empty($base)) {
            $base = 'field_'.Str::random(6);
        }

        return $base;
    }

    public function buildValidationRules(iterable $fields): array
    {
        $rules = [];

        foreach ($fields as $field) {
            if (! $field instanceof ContactFormField) {
                $field = new ContactFormField($field);
            }

            $fieldRules = [];

            if ($field->is_required) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            foreach ($field->validation_rules ?? [] as $rule => $value) {
                if (! in_array($rule, self::WHITELISTED_RULES, true)) {
                    continue;
                }

                if (in_array($rule, ['min', 'max', 'regex'], true)) {
                    if (is_string($value) || is_numeric($value)) {
                        $fieldRules[] = "{$rule}:{$value}";
                    }
                } elseif ($rule === 'required' && ! $field->is_required) {
                    continue;
                } else {
                    $fieldRules[] = $rule;
                }
            }

            if (! in_array('string', $fieldRules, true) && ! in_array('email', $fieldRules, true) && ! in_array('url', $fieldRules, true)) {
                $fieldRules[] = 'string';
            }

            $rules[$field->name] = $fieldRules;
        }

        return $rules;
    }

    public function normalizeFormData(Request $request, iterable $fields): array
    {
        $normalized = [];

        foreach ($fields as $field) {
            if (! $field instanceof ContactFormField) {
                $field = new ContactFormField($field);
            }

            $name = $field->name;
            $type = $field->type instanceof ContactFormFieldType
                ? $field->type
                : ContactFormFieldType::from((string) $field->type);

            if ($type === ContactFormFieldType::Checkbox) {
                $normalized[$name] = $request->boolean($name);

                continue;
            }

            if ($type->hasOptions()) {
                $normalized[$name] = $request->input($name);

                continue;
            }

            if ($request->filled($name)) {
                $normalized[$name] = $request->input($name);
            }
        }

        return $normalized;
    }

    /**
     * Validate a public submission against safe, stored field configuration.
     *
     * @throws ValidationException
     */
    public function validateSubmission(Request $request, array $fields): void
    {
        $rules = $this->buildValidationRules($fields);

        $rules['name'] = ['required', 'string', 'max:255'];
        $rules['email'] = $request->input('email') !== null
            ? ['required', 'email', 'max:255']
            : ['email', 'max:255'];
        $rules['phone'] = ['nullable', 'string', 'max:50'];
        $rules['subject'] = ['nullable', 'string', 'max:255'];
        $rules['message'] = ['nullable', 'string', 'max:5000'];

        $validator = Validator::make($request->all(), $rules);

        if (config('contact.honeypot_enabled', true) && $request->filled('website')) {
            $validator->errors()->add('website', 'Submission rejected.');
        }

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }
}
