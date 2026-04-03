import { CryptoManager, TwilioManager } from '../config';
import { OTPSource } from '../constants';
import { OtpModel } from '../db';
import TimeHelper from './time.helpers';

class UtilsHelper {
  public getSafeUserPayload(payload: Record<string, any>) {
    const { password, ...rest } = payload;
    return rest;
  }

  public async sendOtp(phone: string): Promise<boolean> {
    const cryptoManager = new CryptoManager();
    const otp = cryptoManager.generateOtp();
    const twilioManager = TwilioManager.getInstance();
    const from = process.env.SMS_FROM_NUMBER;

    if (!from) {
      throw new Error('Twilio from number not found');
    }

    await twilioManager.messages.create({
      body: `Please use the following OTP to verify your phone number. OTP: ${otp}. This OTP will expire in 5 minutes. Do not share this OTP with anyone.`,
      from,
      to: phone,
    });

    const timeHelper = new TimeHelper();
    const expiresAt = new Date(timeHelper.plusMinutes(5));

    await OtpModel.findOneAndUpdate(
      { phone },
      {
        $set: {
          phone,
          otp,
          expiresAt,
          source: OTPSource.SMS,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return true;
  }
}

export default UtilsHelper;
