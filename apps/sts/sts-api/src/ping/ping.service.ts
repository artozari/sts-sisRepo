import { Injectable } from '@nestjs/common';
import { CreatePingDto } from './dto/create-ping.dto';
import { UpdatePingDto } from './dto/update-ping.dto';

@Injectable()
export class PingService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createPingDto: CreatePingDto) {
    // console.log('createPingDto', createPingDto);
    createPingDto.name += " ";
    createPingDto.name += createPingDto.age.toString();
    createPingDto.age += 10;
    return createPingDto;
  }

  findAll() {
    const data={
      srv: 'sts-api',
      date: new Date()
    }
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} ping`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePingDto: UpdatePingDto) {
    return `This action updates a #${id} ping`;
  }

  remove(id: number) {
    return `This action removes a #${id} ping`;
  }
}
