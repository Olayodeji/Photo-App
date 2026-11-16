// Paystack is the source of truth: access lasts only while the subscription is active.
const { ps, codeOf, res } = require('../lib');
exports.handler = async e => {
  try {
    const code = codeOf(JSON.parse(e.body || '{}').token);
    if (!code) return res(401, { active: false, error: 'Invalid access key.' });
    const j = await ps('/customer/' + encodeURIComponent(code));
    const subs = (j.data && j.data.subscriptions) || [];
    const now = Date.now();
    const ok = subs.some(s => s.status === 'active' ||
      (s.status === 'non-renewing' && (!s.next_payment_date || new Date(s.next_payment_date) > now)));
    return res(200, { active: ok });
  } catch (x) { return res(500, { active: false, error: 'Could not check your subscription.' }); }
};
