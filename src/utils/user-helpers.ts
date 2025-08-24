export function getFirstName(fullName: string): string {
    if (!fullName) {
        return ""
    }
    const parts = fullName.split(' ')
    return parts[0]
}
