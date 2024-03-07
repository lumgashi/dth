import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * @description This fuction is using to create a new token
 * @param {String} payload - Is the token payload, in our case is userId, email and role.
 * @returns {Promise<Object|Boolean>} - return a string
 */
export async function signToken(
  payload: { id: string; email: string; role: string },
  expiresIn?: string,
): Promise<string> {
  const jwtService = new JwtService();
  const config = new ConfigService();
  try {
    return jwtService.sign(payload, {
      secret: config.get('app.jwtSecret'),
      expiresIn: config.get('app.tokenExpiresIn') || expiresIn,
    });
  } catch (err) {
    throw err;
  }
}
