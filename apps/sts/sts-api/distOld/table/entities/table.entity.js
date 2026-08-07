"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableEntityClass = void 0;
const openapi = require("@nestjs/swagger");
class TableEntityClass {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, key: { required: true, type: () => String }, name: { required: true, type: () => String }, shortName: { required: true, type: () => String }, enabled: { required: true, type: () => Boolean }, noSmoking: { required: true, type: () => Boolean }, tableNumber: { required: true, type: () => Number }, posX: { required: true, type: () => Number }, posY: { required: true, type: () => Number }, layout: { required: true, type: () => Number }, configTableId: { required: true, type: () => Number }, lastCutOff: { required: true, type: () => Object } };
    }
}
exports.TableEntityClass = TableEntityClass;
//# sourceMappingURL=table.entity.js.map