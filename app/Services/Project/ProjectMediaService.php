<?php

declare(strict_types=1);

namespace App\Services\Project;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectMediaService
{
    /**
     * @var list<string>
     */
    private const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    /**
     * @var list<string>
     */
    private const DOCUMENT_MIME_TYPES = ['application/pdf'];

    public function uploadImage(?UploadedFile $file, string $path = 'projects'): ?string
    {
        return $this->store($file, $path, self::IMAGE_MIME_TYPES, $this->imageMaxKb());
    }

    public function uploadDocument(?UploadedFile $file, string $path = 'projects'): ?string
    {
        return $this->store($file, $path, self::DOCUMENT_MIME_TYPES, $this->documentMaxKb());
    }

    public function replaceImage(?string $existingPath, ?UploadedFile $file, string $path = 'projects'): ?string
    {
        return $this->replace($existingPath, $file, fn (?UploadedFile $file) => $this->uploadImage($file, $path));
    }

    public function replaceDocument(?string $existingPath, ?UploadedFile $file, string $path = 'projects'): ?string
    {
        return $this->replace($existingPath, $file, fn (?UploadedFile $file) => $this->uploadDocument($file, $path));
    }

    public function delete(?string $path): void
    {
        if ($path === null || $path === '' || Str::startsWith($path, ['http://', 'https://'])) {
            return;
        }

        Storage::disk($this->disk())->delete($path);
    }

    /**
     * @param  callable(?UploadedFile): ?string  $store
     */
    private function replace(?string $existingPath, ?UploadedFile $file, callable $store): ?string
    {
        if (! $file instanceof UploadedFile) {
            return null;
        }

        $stored = $store($file);

        if ($stored !== null) {
            $this->delete($existingPath);
        }

        return $stored;
    }

    /**
     * @param  list<string>  $allowedMimeTypes
     */
    private function store(?UploadedFile $file, string $path, array $allowedMimeTypes, int $maxKb): ?string
    {
        if (! $file instanceof UploadedFile) {
            return null;
        }

        if (! in_array($file->getMimeType(), $allowedMimeTypes, true)) {
            Log::warning('Rejected project media upload: unsupported mime type', [
                'mime' => $file->getMimeType(),
                'name' => $file->getClientOriginalName(),
            ]);

            return null;
        }

        if ($file->getSize() > $maxKb * 1024) {
            Log::warning('Rejected project media upload: file too large', [
                'size' => $file->getSize(),
                'max_kb' => $maxKb,
            ]);

            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
        $name = Str::uuid()->toString().'.'.$extension;

        return $file->storeAs($path, $name, $this->disk());
    }

    private function disk(): string
    {
        return (string) config('projects.media.disk', 'public');
    }

    private function imageMaxKb(): int
    {
        return (int) config('projects.media.image_max_kb', 4096);
    }

    private function documentMaxKb(): int
    {
        return (int) config('projects.media.document_max_kb', 8192);
    }
}
