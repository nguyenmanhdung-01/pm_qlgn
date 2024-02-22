import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { BangUser } from '../utils/typeorm';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
// import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([BangUser])],
  controllers: [UsersController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
  ],
})
export class UsersModule {}
