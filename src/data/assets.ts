import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Evaluated at build time. The link appears only after the real CV has been added.
export const hasCv = existsSync(join(process.cwd(), 'public', 'cv', 'vince-benitez-cv.pdf'));
