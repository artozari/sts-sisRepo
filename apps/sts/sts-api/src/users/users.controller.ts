import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user.' })
  @ApiResponse({ status: 201, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Duplicate entry.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find user by email.' })
  @ApiParam({ name: 'email', type: String, example: 'john.deere@example.com' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @ApiOperation({ summary: 'Get a single user.' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update one user by email' })
  @ApiParam({ name: 'email', type: String, example: 'john.deere@example.com' })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch('email/:email')
  updateByEmail(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateByEmail(email, updateUserDto);
  }

  @ApiOperation({ summary: 'Update one user' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Process completed.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
