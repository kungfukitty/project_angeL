import mailchimp from '@mailchimp/mailchimp_marketing';
import { config } from '../config/env';
import crypto from 'crypto';

mailchimp.setConfig({
  apiKey: config.mailchimp.apiKey,
  server: config.mailchimp.server,
});

export async function addToMailchimp(
  email: string,
  mergeFields?: Record<string, any>
): Promise<void> {
  try {
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');
    
    await mailchimp.lists.setListMember(
      config.mailchimp.audienceId,
      subscriberHash,
      {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: mergeFields,
      }
    );
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw error;
  }
}
