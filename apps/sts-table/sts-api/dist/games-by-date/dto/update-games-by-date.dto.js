"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGamesByDateDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_games_by_date_dto_1 = require("./create-games-by-date.dto");
class UpdateGamesByDateDto extends (0, mapped_types_1.PartialType)(create_games_by_date_dto_1.CreateGamesByDateDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateGamesByDateDto = UpdateGamesByDateDto;
//# sourceMappingURL=update-games-by-date.dto.js.map