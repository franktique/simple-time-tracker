// This file runs before Next.js starts, allowing us to customize env loading
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Load our custom environment loader before Next.js loads its defaults
    await import('./load-env');
  }
}
