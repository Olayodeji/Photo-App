const { ps, keyOf, res } = require('../lib');
exports.handler = async e => {
  try {
    const { reference } = JSON.parse(e.body || '{}');
    const j = await ps('/transaction/verify/' + encodeURIComponent(reference || ''));
    const d = j.data || {};
    const plan = d.plan_object || d.plan || {};
    const code = typeof plan === 'string' ? plan : plan.plan_code;
    if (!j.status || d.status !== 'success' || code !== process.env.PAYSTACK_PLAN_CODE)
      return res(402, { error: 'We couldn’t confirm that payment.' });
    return res(200, { token: keyOf(d.customer.customer_code) });
  } catch (x) { return res(500, { error: 'Could not confirm payment. Please try again.' }); }
};
