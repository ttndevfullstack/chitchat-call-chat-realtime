import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateFriendDto } from './dto/update-friend.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  findOneByToken(@Req() req: Request) {
    const user = req['user'];
    return this.userService.findById(user.sub);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('friends/:email')
  findFriends(@Param('email') email: string) {
    return this.userService.findFriends(email);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('add-friend')
  addFriend(@Body() updateFriendDto: UpdateFriendDto) {
    return this.userService.addFriend(updateFriendDto);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }
}
