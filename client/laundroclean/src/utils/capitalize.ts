export function capitalilzeFirstLetter(str?: string) {
    if (!str) return '';
    const cleaned = str.replace(/^["']|["']$/g, "");
    return cleaned.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}