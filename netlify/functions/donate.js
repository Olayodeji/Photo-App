// One-off gifts of any amount. Separate from the subscription plan.
const { ps, res } = require('../lib');
const CUR = process.env.DONATE_CURRENCY || 'NGN';
const MIN = 100, MAX = 5000000; // in whole naira
exports.handler = async e => {
  try {
    const b = JSON.parse(e.body || '{}');
    if (b.action === 'check') {
      const j = await ps('/transaction/verify/' + encodeURIComponent(b.reference || ''));
      const d = j.data || {};
      const ok = !!j.status && d.status === 'success' && !!d.metadata && d.metadata.purpose === 'donation';
      return res(200, ok ? { ok: true, amount: d.amount / 100, currency: d.currency } : { ok: false });
    }
    const amount = Math.round(Number(b.amount));
    if (!(amount >= MIN && amount <= MAX)) return res(400, { error: 'Please enter an amount between 100 and 5,000,000.' });
    if (!/^\S+@\S+\.\S+$/.test(b.email || '')) return res(400, { error: 'Please enter a valid email address so Paystack can send your receipt.' });
    const j = await ps('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: b.email,
        amount: amount * 100, // Paystack counts in kobo
        currency: CUR,
        callback_url: (process.env.SITE_URL || process.env.URL) + '/',
        metadata: { purpose: 'donation' }
      })
    });
    if (!j.status) return res(400, { error: j.message || 'Could not start the payment.' });
    return res(200, { url: j.data.authorization_url });
  } catch (x) { return res(500, { error: 'Something went wrong. Please try again.' }); }
};
