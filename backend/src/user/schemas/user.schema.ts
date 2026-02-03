import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  email: 'string';

  @Prop({ required: true })
  password: string;

  @Prop({ default: Roles.PARTICIPANT })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
