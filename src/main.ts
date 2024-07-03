import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './main.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreTransformInterceptor } from './common/interceptors/core-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerOption = new DocumentBuilder()
    .setTitle('AI Assistant API')
    .setDescription('AI Assistant API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {}),
    new CoreTransformInterceptor(),
  );

  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3035);
}
bootstrap();
