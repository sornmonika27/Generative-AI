

export function base64String(data: string): string {
    return Buffer.from(data, 'base64').toString('utf-8');
}