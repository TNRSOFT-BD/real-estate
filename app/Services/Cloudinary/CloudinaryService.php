<?php

declare(strict_types=1);

namespace App\Services\Cloudinary;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    public function isConfigured(): bool
    {
        return $this->cloudName() !== null
            && $this->apiKey() !== null
            && $this->apiSecret() !== null;
    }

    /**
     * Signed parameters for a direct browser upload. This lets large videos go
     * straight to Cloudinary without passing through PHP's post_max_size.
     *
     * @return array{cloud_name: string, api_key: string, timestamp: int, folder: string, signature: string, upload_url: string, max_kb: int}|null
     */
    public function uploadSignature(): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $timestamp = time();
        $folder = (string) config('cloudinary.folder', 'site/hero');
        $params = ['folder' => $folder, 'timestamp' => $timestamp];

        return [
            'cloud_name' => (string) $this->cloudName(),
            'api_key' => (string) $this->apiKey(),
            'timestamp' => $timestamp,
            'folder' => $folder,
            'signature' => $this->sign($params),
            'upload_url' => $this->endpoint('video/upload'),
            'max_kb' => (int) config('cloudinary.video_max_kb', 51200),
        ];
    }

    /**
     * Upload a video to Cloudinary.
     *
     * @return array{url: string, public_id: string}|null
     */
    public function uploadVideo(UploadedFile $file): ?array
    {
        if (! $this->isConfigured()) {
            Log::error('Cloudinary is not configured; cannot upload hero video.');

            return null;
        }

        $stream = @fopen($file->getRealPath(), 'rb');

        if ($stream === false) {
            Log::error('Unable to open uploaded video for Cloudinary upload.');

            return null;
        }

        try {
            $params = [
                'folder' => (string) config('cloudinary.folder', 'site/hero'),
                'timestamp' => time(),
            ];

            $response = Http::attach('file', $stream, $file->getClientOriginalName())
                ->post($this->endpoint('video/upload'), [
                    ...$params,
                    'api_key' => $this->apiKey(),
                    'signature' => $this->sign($params),
                ]);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        if (! $response->successful()) {
            Log::error('Cloudinary video upload failed.', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        $url = (string) $response->json('secure_url');
        $publicId = (string) $response->json('public_id');

        if ($url === '' || $publicId === '') {
            Log::error('Cloudinary video upload returned an unexpected payload.', ['body' => $response->body()]);

            return null;
        }

        return ['url' => $url, 'public_id' => $publicId];
    }

    public function deleteVideo(?string $publicId): bool
    {
        if ($publicId === null || $publicId === '' || ! $this->isConfigured()) {
            return false;
        }

        $params = [
            'public_id' => $publicId,
            'invalidate' => 'true',
            'timestamp' => time(),
        ];

        $response = Http::asForm()->post($this->endpoint('video/destroy'), [
            ...$params,
            'api_key' => $this->apiKey(),
            'signature' => $this->sign($params),
        ]);

        if (! $response->successful()) {
            Log::warning('Cloudinary video delete failed.', [
                'public_id' => $publicId,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    /**
     * @param  array<string, string|int>  $params
     */
    private function sign(array $params): string
    {
        ksort($params);

        $pairs = [];

        foreach ($params as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $pairs[] = $key.'='.$value;
        }

        return sha1(implode('&', $pairs).$this->apiSecret());
    }

    private function endpoint(string $path): string
    {
        return sprintf('https://api.cloudinary.com/v1_1/%s/%s', $this->cloudName(), $path);
    }

    private function cloudName(): ?string
    {
        $value = config('cloudinary.cloud_name');

        return is_string($value) && $value !== '' ? $value : null;
    }

    private function apiKey(): ?string
    {
        $value = config('cloudinary.api_key');

        return is_string($value) && $value !== '' ? $value : null;
    }

    private function apiSecret(): string
    {
        $value = config('cloudinary.api_secret');

        return is_string($value) ? $value : '';
    }
}
