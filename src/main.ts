import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StructuredLogger } from './logger';

const logger = new StructuredLogger();

async function bootstrap() {
  const port = process.env.APP_PORT || '3000';
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(port);
}

bootstrap().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});
