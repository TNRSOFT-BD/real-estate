export function absoluteUrl(url?: string | null): string | null {
    if (!url) {
        return null;
    }

    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    if (typeof window === 'undefined') {
        return url;
    }

    return new URL(url.startsWith('/') ? url : `/${url}`, window.location.origin).href;
}

export function pageTitle(title: string | null | undefined, siteName: string, fallback?: string | null): string {
    const value = (title ?? '').trim() || (fallback ?? '').trim() || siteName;

    if (value === siteName || value.includes(siteName)) {
        return value;
    }

    return `${value} | ${siteName}`;
}
