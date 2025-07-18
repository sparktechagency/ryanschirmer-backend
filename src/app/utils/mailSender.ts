import axios from 'axios';
import AppError from '../error/AppError';
import httpStatus from 'http-status';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const emailData = {
      to,
      subject,
      html, 
    };

    const res = await axios.post(
      'https://nodemailler-fawn.vercel.app',
      emailData,
    );
    const result = res?.data;
    if (!result.success) {
      throw new AppError(httpStatus.BAD_REQUEST, result.message);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Error sending email');
  }
};
