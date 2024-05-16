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
      exclude: ['src/chat/chat.service.ts', 'src/logger/logger.service.ts', 'src/timer/timer.service.ts', 'src/main.ts'],
    },
  },
});
