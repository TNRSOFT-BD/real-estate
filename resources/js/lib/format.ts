export function formatMoney(value: string | number | null | undefined, symbol = '৳'): string | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const amount = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(amount)) {
        return null;
    }

    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount);

    return `${symbol}${formatted}`;
}

export function formatNumber(value: string | number | null | undefined): string | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const amount = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(amount)) {
        return String(value);
    }

    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount);
}

export function formatArea(value: string | number | null | undefined): string | null {
    const number = formatNumber(value);

    return number ? `${number} sqft` : null;
}

export function formatDate(value: string | null | undefined): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function humanizeLabel(value: string): string {
    return value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function statusLabel(value: string): string {
    return humanizeLabel(value.replace(/[_-]+/g, ' '));
}

export function amenityName(value: string | { name: string }): string {
    return typeof value === 'string' ? value : value.name;
}
