import { CreatePingDto } from './dto/create-ping.dto';
import { UpdatePingDto } from './dto/update-ping.dto';
export declare class PingService {
    create(createPingDto: CreatePingDto): CreatePingDto;
    findAll(): {
        srv: string;
        date: Date;
    };
    findOne(id: number): string;
    update(id: number, updatePingDto: UpdatePingDto): string;
    remove(id: number): string;
}
