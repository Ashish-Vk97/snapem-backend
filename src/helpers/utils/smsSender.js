// const brevo = require('@getbrevo/brevo');

// const defaultClient = brevo.ApiClient.instance;
// const apiKey = defaultClient.authentications['apiKey'];
// apiKey.apiKey = "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";

// const smsApi = new brevo.TransactionalSMSApi();

   const Brevo = require('@getbrevo/brevo');
   const brevoClient = new Brevo.TransactionalSMSApi();
const apiKey = process.env.BREVO_SNAPEM_API_KEY; // Replace with your actual API key
brevoClient.setApiKey(Brevo.TransactionalSMSApiApiKeys.apiKey, apiKey);

 




module.exports = {
  sendSMS: async ({ recipient, content }) => {
  const sendTransacSms = {
  sender: 'SNAPEM', // Must be an approved sender ID for some countries
  recipient: `+91${recipient}` || '+917787923930', // International format (E.164)
  content: content || 'Hello Dear please Help me  Watch SOS video: https://snapem.s3.us-east-1.amazonaws.com/videos/1749974515657_videos_snapem.mp4',
  type: 'transactional'
};

     

    try {
      const response = await brevoClient.sendTransacSms(sendTransacSms)
      console.log('SMS sent successfully:', response);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
};
