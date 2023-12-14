import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/common/enums/enums';
import { Role } from 'src/user/role/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: false })
  status: UserStatus;

  @Prop({ type: [String], default: [] })
  friends: string[];

  @Prop({ require: true, default: Role.User })
  role: Role[];

  @Prop({
    type: [String],
    ref: 'Chatroom',
  })
  chatroom_ids: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
