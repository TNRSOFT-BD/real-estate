<?php

declare(strict_types=1);

namespace App\Services\Site;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SiteMediaService
{
    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    private const MAX_SIZE_KB = 5120;

    public function upload(UploadedFile $file, string $path = 'site'): ?string
    {
        if (! $this->validateUpload($file)) {
            return null;
        }

        $filename = Str::uuid().'.'.strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');

        $stored = $this->disk()->putFileAs($path, $file, $filename);

        if (! is_string($stored)) {
            Log::error('Failed to store site media', ['path' => $path, 'disk' => $this->diskName()]);

            return null;
        }

        return $stored;
    }

    public function replace(?string $existingPath, UploadedFile $file, string $path = 'site'): ?string
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

        $this->disk()->delete($path);
    }

    public function validateUpload(UploadedFile $file): bool
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES, true)) {
            Log::warning('Rejected site media: invalid MIME type', ['mime' => $file->getMimeType()]);

            return false;
        }

        if ($file->getSize() > self::MAX_SIZE_KB * 1024) {
            Log::warning('Rejected site media: file too large', ['size' => $file->getSize()]);

            return false;
        }

        return true;
    }

    private function disk(): Filesystem
    {
        return Storage::disk($this->diskName());
    }

    private function diskName(): string
    {
        return (string) config('site.media.disk', 'public');
    }
}
