"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingService = void 0;
const common_1 = require("@nestjs/common");
let PingService = class PingService {
    create(createPingDto) {
        createPingDto.name += " ";
        createPingDto.name += createPingDto.age.toString();
        createPingDto.age += 10;
        return createPingDto;
    }
    findAll() {
        const data = {
            srv: 'sts-api',
            date: new Date()
        };
        return data;
    }
    findOne(id) {
        return `This action returns a #${id} ping`;
    }
    update(id, updatePingDto) {
        return `This action updates a #${id} ping`;
    }
    remove(id) {
        return `This action removes a #${id} ping`;
    }
};
exports.PingService = PingService;
exports.PingService = PingService = __decorate([
    (0, common_1.Injectable)()
], PingService);
//# sourceMappingURL=ping.service.js.map