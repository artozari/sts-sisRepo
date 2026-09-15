"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCutoffDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateCutoffDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number, nullable: true }, time: { required: true, type: () => String }, key: { required: true, type: () => String }, create_at: { required: true, type: () => String }, enable: { required: true, type: () => Boolean }, tick: { required: true, type: () => String }, liberado: { required: true, type: () => String }, hash: { required: true, type: () => String }, attempts: { required: true, type: () => Number } };
    }
}
exports.CreateCutoffDto = CreateCutoffDto;
//# sourceMappingURL=create-cutoff.dto.js.map