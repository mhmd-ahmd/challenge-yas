export function handleError(error: unknown, message: string) {
  if (error instanceof Error) {
    console.error(`${message}: ${error.message}`);
  } else {
    console.error(`Unknown error in ${message}`);
  }
}
