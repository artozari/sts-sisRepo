"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_class_1 = require("@slcn-pkg/config-class");
const individual_validator_class_1 = require("./individualValidators/classes/individual.validator.class");
const APP_VERSION = '1.0.0';
const APP_NAME = 'sts-api';
const urlSwagger = 'docs';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: common_1.VersioningType.URI });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('STS-API')
        .setDescription('The STS API description')
        .setVersion('0.1')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(urlSwagger, app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const callBackIndividualConfig = (p_obj) => {
        let resp;
        try {
            if (p_obj === null || p_obj === undefined) {
                throw new Error('Object is null or undefined');
            }
            const dataCheck = new individual_validator_class_1.IndividualValidatorClass(p_obj);
            resp = (0, class_validator_1.validateSync)(dataCheck, { whitelist: true });
            if (resp instanceof Array && resp.length === 0) {
                resp = dataCheck;
            }
        }
        catch (error) {
            resp = error;
        }
        return resp;
    };
    const callBackGeneralConfig = (p_obj) => {
        let resp;
        try {
            if (p_obj === null || p_obj === undefined) {
                throw new Error('Object is null or undefined');
            }
            const dataCheck = new config_class_1.GeneralConfigValidatorClass(p_obj);
            resp = (0, class_validator_1.validateSync)(dataCheck, { whitelist: true });
            if (resp instanceof Array && resp.length === 0) {
                resp = dataCheck;
            }
        }
        catch (error) {
            resp = error;
        }
        return resp;
    };
    const CONFIG = new config_class_1.ConfigClass(APP_NAME, APP_VERSION, __dirname, callBackGeneralConfig, callBackIndividualConfig, undefined, true);
    const port = CONFIG.getNumber(['HTTP', 'PORT']);
    await app.listen(port).then(() => {
        common_1.Logger.log(`STS-API listening on http://localhost:${port}`, 'bootstrap');
        common_1.Logger.log(`Swagger on http://localhost:${port}/${urlSwagger}`, 'bootstrap');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map