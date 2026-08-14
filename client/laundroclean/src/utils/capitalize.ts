export function capitalilzeFirstLetter(str: string) {
    if (!str) return '';
    str = str.toLowerCase()
    return str.charAt(0).toUpperCase() + str.slice(1)
}