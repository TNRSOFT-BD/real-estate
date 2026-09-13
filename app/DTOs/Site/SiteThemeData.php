<?php

declare(strict_types=1);

namespace App\DTOs\Site;

use App\Models\Site\SiteSetting;

final class SiteThemeData
{
    public function __construct(
        public readonly string $backgroundColor,
        public readonly string $themeMode,
        public readonly string $mode,
    ) {}

    public static function fromModel(SiteSetting $settings): self
    {
        $backgroundColor = $settings->background_color ?: '#F4F2ED';
        $themeMode = $settings->theme_mode ?: 'auto';

        return new self(
            backgroundColor: $backgroundColor,
            themeMode: $themeMode,
            mode: self::resolveMode($backgroundColor, $themeMode),
        );
    }

    public static function resolveMode(string $backgroundColor, string $themeMode): string
    {
        if (in_array($themeMode, ['light', 'dark'], true)) {
            return $themeMode;
        }

        return self::isDark($backgroundColor) ? 'dark' : 'light';
    }

    private static function isDark(string $hex): bool
    {
        $hex = ltrim(trim($hex), '#');

        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }

        if (strlen($hex) !== 6 || ! ctype_xdigit($hex)) {
            return false;
        }

        $r = hexdec(substr($hex, 0, 2)) / 255;
        $g = hexdec(substr($hex, 2, 2)) / 255;
        $b = hexdec(substr($hex, 4, 2)) / 255;

        $luminance = 0.2126 * $r + 0.7152 * $g + 0.0722 * $b;

        return $luminance < 0.5;
    }

    public function toArray(): array
    {
        return [
            'background_color' => $this->backgroundColor,
            'theme_mode' => $this->themeMode,
            'mode' => $this->mode,
        ];
    }
}
