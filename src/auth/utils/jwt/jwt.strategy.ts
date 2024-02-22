import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { ConfigService } from '@nestjs/config';
import { PayloadgenerateToken } from 'src/utils/types';
import { IUserService } from 'src/users/users';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(userName: PayloadgenerateToken) {
    return this.userService.findByUsername(userName.username);
  }
}
