"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
const openapi = require("@nestjs/swagger");
class ProfileEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, phone: { required: true, type: () => String }, lastName: { required: true, type: () => String }, userId: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ProfileEntity = ProfileEntity;
//# sourceMappingURL=profile.entity.js.map