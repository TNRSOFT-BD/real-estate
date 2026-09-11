<?php

declare(strict_types=1);

namespace App\Services\Contact;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ContactMediaService
{
    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    private const MAX_SIZE_KB = 2048;

    public function upload(UploadedFile $file, string $path = 'contact'): ?string
    {
        if (! $this->validateUpload($file)) {
            return null;
        }

        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();

        return Storage::disk(config('filesystems.default'))->putFileAs($path, $file, $filename);
    }

    public function replace(?string $existingPath, UploadedFile $file, string $path = 'contact'): ?string
    {
        $newPath = $this->upload($file, $path);

        if ($newPath !== null && $existingPath && $existingPath !== $newPath) {
            $this->delete($existingPath);
        }

        return $newPath;
    }

    public function delete(?string $path): void
    {
        if (! $path || str_starts_with($path, 'http')) {
            return;
        }

        Storage::disk(config('filesystems.default'))->delete($path);
    }

    public function validateUpload(UploadedFile $file): bool
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES, true)) {
            Log::warning('Rejected upload: invalid MIME type', ['mime' => $file->getMimeType()]);

            return false;
        }

        if ($file->getSize() > self::MAX_SIZE_KB * 1024) {
            Log::warning('Rejected upload: file too large', ['size' => $file->getSize()]);

            return false;
        }

        return true;
    }
}
