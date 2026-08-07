"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasinoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_casino_dto_1 = require("./create-casino.dto");
class UpdateCasinoDto extends (0, swagger_1.PartialType)(create_casino_dto_1.CreateCasinoDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCasinoDto = UpdateCasinoDto;
//# sourceMappingURL=update-casino.dto.js.map