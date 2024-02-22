import {
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Body,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IUserService } from './users';
import { BangUser } from 'src/utils/typeorm';
import { ChangPassWord, editUser } from 'src/utils/types';
import JwtAuthenticationGuard from 'src/auth/utils/jwt/jwt-authentication.guard';
import { AuthUser } from 'src/utils/decorators';

@Controller(Routes.USERS)
export class UsersController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Get('getByName/:username')
  async getUserByName(
    @Param('username') TenDangNhap: string,
  ): Promise<BangUser> {
    return this.userService.findByUsername(TenDangNhap);
  }

  @Get('getAll')
  async getAll(
    @Query('search') search: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderByParam') orderByParam: string,
    @Query('desc') desc: string,
    @Query('status') status: string,
  ): Promise<BangUser> {
    return this.userService.getAll(
      search,
      offset,
      limit,
      orderByParam,
      desc,
      status,
    );
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get('getByID/:id')
  async getByID(@Param('id') id: number): Promise<BangUser> {
    return this.userService.findById(id);
  }

  @Put('edit/:id')
  async editUser(
    @Param('id') id: number,
    @Body() editUser: editUser,
  ): Promise<BangUser> {
    return this.userService.editUser(id, editUser);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Put('editPassword')
  async editPassword(
    @AuthUser() user,
    @Body() password: ChangPassWord,
  ): Promise<BangUser> {
    return this.userService.editPassword(user, password);
  }

  @Delete('delete')
  async delete(
    @Body() { idDelete }: { idDelete: number[] },
  ): Promise<BangUser[]> {
    return this.userService.delete(idDelete);
  }
}
