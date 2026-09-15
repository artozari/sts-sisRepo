import { PingService } from './ping.service';
import { CreatePingDto } from './dto/create-ping.dto';
import { UpdatePingDto } from './dto/update-ping.dto';
export declare class PingController {
    private readonly pingService;
    constructor(pingService: PingService);
    create(createPingDto: CreatePingDto): CreatePingDto;
    findAll(): {
        srv: string;
        date: Date;
    };
    findOne(id: string): string;
    update(id: string, updatePingDto: UpdatePingDto): string;
    remove(id: string): string;
}
