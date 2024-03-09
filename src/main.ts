import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'types';
import { validationOptions } from './utils/functions';
import { initCategories } from './utils/functions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  //app.use(CacheControlMiddleware);
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  //app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle(configService.getOrThrow('app.name', { infer: true }))
    .setDescription(
      configService.getOrThrow('app.description', { infer: true }),
    )
    .setVersion(configService.getOrThrow('app.version', { infer: true }))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   *=============================================================
   * START STARTUP FUNCTIONS
   *=============================================================
   */
  initCategories();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
