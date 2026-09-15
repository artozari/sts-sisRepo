"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInterface = void 0;
const openapi = require("@nestjs/swagger");
class GameInterface {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, gameNumber: { required: true, type: () => Number }, winNumber: { required: true, type: () => Number }, rpm: { required: true, type: () => Number }, clockwise: { required: true, type: () => Boolean }, openTable: { required: true, type: () => Boolean }, enabled: { required: true, type: () => Boolean }, croupierId: { required: true, type: () => Number } };
    }
}
exports.GameInterface = GameInterface;
//# sourceMappingURL=game.entity.js.map