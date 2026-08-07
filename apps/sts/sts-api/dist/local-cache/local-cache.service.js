"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCacheService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
let LocalCacheService = class LocalCacheService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.set = async (p_key, p_value, p_ttl) => {
            const ttl = p_ttl || undefined;
            await this.cacheManager.set(p_key, p_value, ttl);
        };
        this.get = async (p_key) => {
            try {
                const resp = await this.cacheManager.get(p_key);
                return resp;
            }
            catch (error) {
                return null;
            }
        };
        this.del = async (p_key) => {
            try {
                await this.cacheManager.del(p_key);
            }
            catch (error) {
            }
        };
        this.reset = async () => {
            try {
                await this.cacheManager.reset();
            }
            catch (error) {
            }
        };
        this.getKey = (p_key, p_id) => {
            let resp;
            if (p_id) {
                resp = `${p_key}_${p_id}`;
            }
            else {
                resp = p_key;
            }
            return resp;
        };
    }
};
exports.LocalCacheService = LocalCacheService;
exports.LocalCacheService = LocalCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], LocalCacheService);
//# sourceMappingURL=local-cache.service.js.map