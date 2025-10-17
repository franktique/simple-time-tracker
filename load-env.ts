import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load environment variables with custom priority:
// 1. Try to load .env first
// 2. If .env doesn't exist, load .env.local instead
export function loadEnvironment() {
  const envPath = resolve(process.cwd(), '.env');
  const envLocalPath = resolve(process.cwd(), '.env.local');

  if (existsSync(envPath)) {
    // .env exists, load it
    config({ path: envPath });
    console.log('Loaded environment variables from .env');
  } else if (existsSync(envLocalPath)) {
    // .env doesn't exist, fall back to .env.local
    config({ path: envLocalPath });
    console.log('Loaded environment variables from .env.local');
  } else {
    console.warn('Neither .env nor .env.local found');
  }
}

// Load environment variables immediately
loadEnvironment();
