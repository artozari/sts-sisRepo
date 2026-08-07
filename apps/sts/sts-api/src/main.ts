import { validateSync, ValidationError } from 'class-validator';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import {
  ConfigClass,
  ConfigFileValidatorType,
  GeneralConfigValidatorClass,
  GeneralConfigValidatorInterface,
} from '@slcn-pkg/config-class';
import { IndividualValidatorClass } from './individualValidators/classes/individual.validator.class';
import { IndividualValidatorInterface } from './individualValidators/interfaces/individual.validator.interface';

const APP_VERSION: string = '1.0.0';
const APP_NAME: string = 'sts-api';
const urlSwagger: string = 'docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('STS-API')
    .setDescription('The STS API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(urlSwagger, app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // *********************
  // *** CONFIGURATION ***
  // *********************
  const callBackIndividualConfig = (
    p_obj: object | null | undefined,
  ): ConfigFileValidatorType => {
    let resp: ConfigFileValidatorType;

    try {
      if (p_obj === null || p_obj === undefined) {
        throw new Error('Object is null or undefined');
      }
      const dataCheck: IndividualValidatorClass = new IndividualValidatorClass(
        p_obj as IndividualValidatorInterface,
      );
      resp = validateSync(dataCheck, { whitelist: true });
      if (resp instanceof Array && resp.length === 0) {
        resp = dataCheck;
      }
    } catch (error) {
      resp = error as Error;
    }
    return resp;
  };

  const callBackGeneralConfig = (
    p_obj: object | null | undefined,
  ): ConfigFileValidatorType => {
    let resp: ValidationError[] | Error | object;

    try {
      if (p_obj === null || p_obj === undefined) {
        throw new Error('Object is null or undefined');
      }
      const dataCheck: GeneralConfigValidatorClass =
        new GeneralConfigValidatorClass(
          p_obj as GeneralConfigValidatorInterface,
        );
      resp = validateSync(dataCheck, { whitelist: true });
      if (resp instanceof Array && resp.length === 0) {
        resp = dataCheck;
      }
    } catch (error) {
      resp = error as Error;
    }
    return resp;
  };

  const CONFIG: ConfigClass = new ConfigClass(
    APP_NAME,
    APP_VERSION,
    __dirname,
    callBackGeneralConfig,
    callBackIndividualConfig,
    undefined,
    true,
  );

  const port: number = CONFIG.getNumber(['HTTP', 'PORT']);
  await app.listen(port).then(() => {
    Logger.log(`STS-API listening on http://localhost:${port}`, 'bootstrap');
    Logger.log(`Swagger on http://localhost:${port}/${urlSwagger}`, 'bootstrap');
  });
}
bootstrap();
