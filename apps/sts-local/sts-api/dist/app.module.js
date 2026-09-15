"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const games_module_1 = require("./games/games.module");
const table_module_1 = require("./table/table.module");
const ping_module_1 = require("./ping/ping.module");
const configuration_module_1 = require("./configuration/configuration.module");
const casino_module_1 = require("./casino/casino.module");
const local_cache_module_1 = require("./local-cache/local-cache.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const users_module_1 = require("./users/users.module");
const profiles_module_1 = require("./profiles/profiles.module");
const games_by_date_module_1 = require("./games-by-date/games-by-date.module");
const cutoff_module_1 = require("./cutoff/cutoff.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            games_module_1.GamesModule,
            table_module_1.TableModule,
            ping_module_1.PingModule,
            configuration_module_1.ConfigurationModule,
            casino_module_1.CasinoModule,
            cache_manager_1.CacheModule.register(),
            local_cache_module_1.LocalCacheModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            games_by_date_module_1.GamesByDateModule,
            cutoff_module_1.CutoffModule,
        ],
        controllers: [],
        providers: [],
        exports: [cache_manager_1.CacheModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map