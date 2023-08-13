/* istanbul ignore file */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';

export const GetCurrentUsername = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
