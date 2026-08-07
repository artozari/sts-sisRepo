"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_ping_dto_1 = require("./create-ping.dto");
class UpdatePingDto extends (0, swagger_1.PartialType)(create_ping_dto_1.CreatePingDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePingDto = UpdatePingDto;
//# sourceMappingURL=update-ping.dto.js.map