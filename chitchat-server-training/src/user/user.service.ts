/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import config from 'src/common/configs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async updateStatus(email: string, status: string) {
    const user = await this.userModel.findByIdAndUpdate(email, {
      status: status,
    });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user.toObject();

    return {
      status: 201,
      success: true,
      data: result,
    };
  }

  public async findUserByToken(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user.toObject();

    return {
      status: 201,
      success: true,
      data: result,
    };
  }

  public async findById(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user.toObject();

    return {
      status: 201,
      success: true,
      data: result,
    };
  }

  public async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user.toObject();

    return {
      status: 201,
      success: true,
      data: result,
    };
  }

  public async findFriends(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const friends = await this.userModel.find({ email: { $in: user.friends } });

    return {
      status: 201,
      success: true,
      data: friends,
    };
  }

  public async addFriend(updateFriendDto: UpdateFriendDto) {
    const user = await this.userModel.findOne({
      email: updateFriendDto.email,
    });
    if (!user) throw new NotFoundException('User not found');

    const updated_friend = user.friends.includes(updateFriendDto.email_friend)
      ? user.friends
      : [...user.friends, updateFriendDto.email_friend];

    const updated_user = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { friends: updated_friend },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updated_user,
    };
  }

  public async unFriend(updateFriendDto: UpdateFriendDto) {
    const user = await this.userModel.findOne({
      email: updateFriendDto.email,
    });
    if (!user) throw new NotFoundException('User not found');

    const updated_friend = user.friends.includes(updateFriendDto.email_friend)
      ? user.friends.filter((friend) => friend !== updateFriendDto.email_friend)
      : user.friends;

    const updated_user = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { friends: updated_friend },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updated_user,
    };
  }

  public async findAllUserInRoom(members: string[]) {
    const users = await this.userModel.find({ email: { $in: members } });

    return {
      status: 201,
      success: true,
      data: users,
    };
  }

  public async findAll() {
    const users = await this.userModel.find({});
    return {
      status: 201,
      success: true,
      data: users,
    };
  }

  public async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) throw new BadRequestException('User is exist');

    const saltOrRounds = config().security.bcryptSaltOrRound;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    createUserDto.password = hash;

    const createdUser = await new this.userModel(createUserDto);
    await createdUser.save();

    return {
      status: 201,
      success: true,
      data: createdUser,
    };
  }

  public async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.userModel.updateOne(
      { email: user.email },
      updateUserDto,
    );

    return {
      status: 201,
      success: true,
      data: updatedUser,
    };
  }

  public async remove(email: string) {
    const deletedUser = await this.userModel.findOneAndDelete({ email });
    if (!deletedUser) throw new NotFoundException('User not found');

    return {
      status: 201,
      success: true,
      data: deletedUser,
    };
  }
}
