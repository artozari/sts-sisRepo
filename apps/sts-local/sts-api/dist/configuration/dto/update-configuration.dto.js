"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_configuration_dto_1 = require("./create-configuration.dto");
class UpdateConfigurationDto extends (0, swagger_1.PartialType)(create_configuration_dto_1.CreateConfigurationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateConfigurationDto = UpdateConfigurationDto;
//# sourceMappingURL=update-configuration.dto.js.map