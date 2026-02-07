import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModal.create(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModal.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModal.findById(id).exec();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModal
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}
