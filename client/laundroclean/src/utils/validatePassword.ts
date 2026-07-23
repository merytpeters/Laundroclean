export const validatePassword = (pwd: string): string | null => {
    if (!pwd || pwd.length < 7) return 'Password must be a minimum of 7 letters';
    if (!/^[A-Z]/.test(pwd)) return 'First letter must be uppercase';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Must contain at least one special character';
    return null;
}