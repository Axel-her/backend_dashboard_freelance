export function cleanEnv(value?: string, name?: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.replace(/^"+|"+$/g, '');
}