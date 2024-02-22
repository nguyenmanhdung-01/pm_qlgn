import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { log } from 'console';
import { Strategy } from 'passport-local';
import { IAuthService } from 'src/auth/auth';
import { Services } from 'src/utils/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {
    super({ usernameField: 'TenDangNhap' });
  }

  async validate(TenDangNhap: string, password: string) {
    // Đổi tên biến từ TenDangNhap và MatKhau thành username và password
    const user = await this.authService.validateUser({
      TenDangNhap,
      password,
    });
    console.log('password', password);
    if (!user) {
      throw new UnauthorizedException(
        'Tên đăng nhập hoặc mật khẩu không hợp lệ',
      );
    }
    return user;
  }
}
