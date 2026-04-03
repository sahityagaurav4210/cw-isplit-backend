import twilio from 'twilio';

class TwilioManager {
  private static instance: twilio.Twilio;

  constructor() {
    if (TwilioManager.instance) {
      return TwilioManager.instance;
    }

    const accountSid = process.env.SMS_ACCOUNT_SID;
    const authToken = process.env.SMS_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not found');
    }

    TwilioManager.instance = twilio(accountSid, authToken);
  }

  public static getInstance(): twilio.Twilio {
    if (!TwilioManager.instance) {
      new TwilioManager();
    }
    return TwilioManager.instance;
  }
}

export default TwilioManager;
