import { Response } from 'express';
import { IUser } from '../types';

export const sendToken = (
  user: IUser,
  statusCode: number,
  message: string,
  res: Response
): void => {
  const token = user.generateToken();
  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE || '7', 10);
  
  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

