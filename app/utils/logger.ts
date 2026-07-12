export function logError(context: string, error: unknown) {
  // In a real application, this would send to Sentry, Datadog, etc.
  console.error(`[ERROR] ${context}:`, error);
}
