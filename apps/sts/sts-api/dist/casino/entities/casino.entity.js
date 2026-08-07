"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoEntityInterface = void 0;
const openapi = require("@nestjs/swagger");
class CasinoEntityInterface {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, casinoCode: { required: true, type: () => String }, name: { required: true, type: () => String }, country: { required: true, type: () => String }, province: { required: true, type: () => String }, city: { required: true, type: () => String }, address: { required: true, type: () => String }, latitude: { required: false, type: () => Number }, longitude: { required: false, type: () => Number }, mqtt_url: { required: true, type: () => String }, mqtt_port: { required: true, type: () => String }, mqtt_protocol: { required: true, type: () => String }, mqtt_tls: { required: true, type: () => Boolean }, mqtt_user: { required: true, type: () => String }, mqtt_password: { required: true, type: () => String }, mqtt_refresh_time_msec: { required: true, type: () => Number } };
    }
}
exports.CasinoEntityInterface = CasinoEntityInterface;
//# sourceMappingURL=casino.entity.js.map