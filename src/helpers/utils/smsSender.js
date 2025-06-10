// const brevo = require('@getbrevo/brevo');

// const defaultClient = brevo.ApiClient.instance;
// const apiKey = defaultClient.authentications['apiKey'];
// apiKey.apiKey = "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";

// const smsApi = new brevo.TransactionalSMSApi();

   const SibApiV3Sdk = require('@getbrevo/brevo');

 
//    let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
//    let apiKey = apiInstance.apiClient.authentications['api-key'];
//    apiKey.apiKey = process.env.BREVO_SMS_KEY; // Replace with your actual API key

//    let sendSms = new SibApiV3Sdk.SendSms();



module.exports = {
  sendSMS: async () => {
    // const smsApi = new brevo.TransactionalSMSApi();

    // const sendTransacSms = new brevo.SendTransacSms();
    // sendTransacSms.sender = "snapem";
    // sendTransacSms.recipient = "+917787923930";
    // sendTransacSms.content = "content of the SMS message goes here";

       sendSms.sender = 'snapem'; // Replace with your sender name
   sendSms.recipient = '+917787923930'; // Replace with recipient phone number
   sendSms.content = 'Your message here';

    try {
      const response = await  apiInstance.sendTransacSms(sendSms);
      console.log('SMS sent successfully:', response);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
};
