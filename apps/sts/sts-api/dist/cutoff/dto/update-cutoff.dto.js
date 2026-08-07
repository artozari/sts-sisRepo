"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCutoffDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cutoff_dto_1 = require("./create-cutoff.dto");
class UpdateCutoffDto extends (0, mapped_types_1.PartialType)(create_cutoff_dto_1.CreateCutoffDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCutoffDto = UpdateCutoffDto;
//# sourceMappingURL=update-cutoff.dto.js.map