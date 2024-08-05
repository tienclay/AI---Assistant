import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './main.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CoreTransformInterceptor } from './common/interceptors/core-transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DISCORD_PACKAGE_NAME,
  DISCORD_SERVICE_NAME,
} from './modules/social-media/discord/discord.pb';
import { join } from 'path';

async function bootstrap() {
  // const CORE_SERVICE_URL = '0.0.0.0:50051';

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: DISCORD_PACKAGE_NAME,
  //     protoPath: join(
  //       process.cwd(),
  //       'node_modules/ai-chatbot-proto/proto/discord.proto',
  //     ),
  //     url: CORE_SERVICE_URL,
  //     loader: {
  //       includeDirs: [join(process.cwd(), 'src/protobuf')],
  //       defaults: true,
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
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

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3035);
}
bootstrap();
