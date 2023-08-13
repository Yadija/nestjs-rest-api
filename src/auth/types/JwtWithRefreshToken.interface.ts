import { JwtPayload } from './Jwt.interface';

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
