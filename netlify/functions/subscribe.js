const { ps, res } = require('../lib');
exports.handler = async e => {
  try {
    const { email } = JSON.parse(e.body || '{}');
    if (!/^\S+@\S+\.\S+$/.test(email || '')) return res(400, { error: 'Please enter a valid email address.' });
    const j = await ps('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email, amount: 100000, currency: 'NGN', // placeholder: your Paystack plan sets the real monthly amount
        plan: process.env.PAYSTACK_PLAN_CODE,
        callback_url: (process.env.SITE_URL || process.env.URL) + '/'
      })
    });
    if (!j.status) return res(400, { error: j.message || 'Could not start payment.' });
    return res(200, { url: j.data.authorization_url });
  } catch (x) { return res(500, { error: 'Could not start payment. Please try again.' }); }
};
