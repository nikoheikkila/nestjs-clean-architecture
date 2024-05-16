import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.{spec,test}.ts'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['src'],
      extension: ['.ts'],
      reporter: ['text', 'html'],
      exclude: ['src/chat.service.ts', 'src/logger.service.ts', 'src/timer.service.ts', 'src/main.ts'],
    },
  },
});
