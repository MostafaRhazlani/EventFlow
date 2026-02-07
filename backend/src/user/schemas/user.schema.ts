import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/roles.enum';
import * as bcrypt from 'bcrypt';

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

  @Prop({ type: String, enum: Roles, default: Roles.PARTICIPANT })
  role: Roles;

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;

  comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  this: User,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
