<?php

declare(strict_types=1);

namespace App\Services\Contact;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ContactMediaService
{
    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];

    private const MAX_SIZE_KB = 2048;

    public function upload(UploadedFile $file, string $path = 'contact'): ?string
    {
        if (! $this->validateUpload($file)) {
            return null;
        }

        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();

        $stored = $this->disk()->putFileAs($path, $file, $filename);

        if (! is_string($stored)) {
            Log::error('Failed to store contact media', ['path' => $path, 'disk' => $this->diskName()]);

            return null;
        }

        return $stored;
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

        $this->disk()->delete($path);
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

    /**
     * Contact media is served from a public URL by the frontend (see mediaUrl()),
     * so it must not be written to the private application disk.
     */
    private function disk(): Filesystem
    {
        return Storage::disk($this->diskName());
    }

    private function diskName(): string
    {
        return (string) config('contact.media.disk', 'public');
    }
}
