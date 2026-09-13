<?php

declare(strict_types=1);

namespace App\Services\Legal;

use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Whitelist sanitizer for Tiptap rich-text output. The backend is the final
 * security boundary, so content is cleaned before it is stored or rendered.
 */
class LegalContentSanitizer
{
    private const ALLOWED_TAGS = [
        'p', 'h1', 'h2', 'h3', 'h4',
        'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
        'ul', 'ol', 'li',
        'a', 'blockquote', 'hr', 'br', 'code', 'pre',
    ];

    private const DANGEROUS_TAGS = [
        'script', 'style', 'iframe', 'object', 'embed', 'noscript',
        'template', 'form', 'input', 'button', 'svg', 'math', 'link', 'meta', 'base',
    ];

    private const BLOCK_TAGS = ['p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'li', 'div'];

    private const SAFE_SCHEMES = ['http', 'https', 'mailto', 'tel'];

    private const ALLOWED_STYLES = [
        'text-align' => ['left', 'center', 'right', 'justify'],
    ];

    public function sanitize(?string $html): string
    {
        $html = (string) $html;

        if (trim($html) === '') {
            return '';
        }

        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);

        $document->loadHTML(
            '<?xml encoding="UTF-8"><div id="legal-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $document->getElementById('legal-root');

        if (! $root instanceof DOMElement) {
            return '';
        }

        $this->cleanChildren($root);

        $output = '';

        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return trim($output);
    }

    private function cleanChildren(DOMNode $node): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if (! $child instanceof DOMElement) {
                continue;
            }

            $tag = strtolower($child->tagName);

            if (in_array($tag, self::DANGEROUS_TAGS, true)) {
                $node->removeChild($child);

                continue;
            }

            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                $this->cleanChildren($child);
                $this->unwrap($child);

                continue;
            }

            $this->sanitizeAttributes($child, $tag);
            $this->cleanChildren($child);
        }
    }

    private function unwrap(DOMElement $element): void
    {
        $parent = $element->parentNode;

        if (! $parent) {
            return;
        }

        while ($element->firstChild) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }

    private function sanitizeAttributes(DOMElement $element, string $tag): void
    {
        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->name);

            if ($name === 'style') {
                if (! in_array($tag, self::BLOCK_TAGS, true)) {
                    $element->removeAttribute('style');

                    continue;
                }

                $safe = $this->sanitizeStyle($attribute->value);

                if ($safe === '') {
                    $element->removeAttribute('style');
                } else {
                    $element->setAttribute('style', $safe);
                }

                continue;
            }

            if ($tag === 'a' && $name === 'href') {
                $safe = $this->sanitizeUrl($attribute->value);

                if ($safe === null) {
                    $element->removeAttribute('href');
                } else {
                    $element->setAttribute('href', $safe);
                }

                continue;
            }

            if ($tag === 'a' && in_array($name, ['title', 'target', 'rel'], true)) {
                continue;
            }

            // Everything else (class, id, on* handlers, data-*, etc.) is dropped.
            $element->removeAttribute($name);
        }
    }

    private function sanitizeStyle(string $style): string
    {
        $safe = [];

        foreach (explode(';', $style) as $declaration) {
            if (! str_contains($declaration, ':')) {
                continue;
            }

            [$property, $value] = explode(':', $declaration, 2);
            $property = strtolower(trim($property));
            $value = strtolower(trim($value));

            if (isset(self::ALLOWED_STYLES[$property]) && in_array($value, self::ALLOWED_STYLES[$property], true)) {
                $safe[] = $property.': '.$value;
            }
        }

        return implode('; ', $safe);
    }

    private function sanitizeUrl(string $url): ?string
    {
        $url = trim(html_entity_decode($url, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $normalized = preg_replace('/[\x00-\x20]+/', '', $url) ?? $url;

        if ($url === '' || $normalized === '') {
            return null;
        }

        if (preg_match('/^(?:javascript|data|vbscript|file):/i', $normalized)) {
            return null;
        }

        if (preg_match('#^([a-z][a-z0-9+.-]*):#i', $normalized, $matches)) {
            $scheme = strtolower($matches[1]);

            if (! in_array($scheme, self::SAFE_SCHEMES, true)) {
                return null;
            }
        }

        return $url;
    }
}
