export function sanitizeText(value) {
    return String(value ?? "").trim();
}

export function createId() {
    return Date.now() + Math.random();
}
