import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: UserDto) {
    await this.usersService.verifyNewUsername(user.username);
    const { username, fullname } = await this.usersService.newUser(user);
    return {
      status: 'success',
      data: {
        username,
        fullname,
      },
    };
  }
}
