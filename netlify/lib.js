const crypto = require('crypto');
const SK = process.env.PAYSTACK_SECRET_KEY;
const TS = process.env.TOKEN_SECRET || SK;

const ps = async (path, opt = {}) => {
  const r = await fetch('https://api.paystack.co' + path, {
    ...opt,
    headers: { Authorization: 'Bearer ' + SK, 'Content-Type': 'application/json' }
  });
  return r.json();
};
const mac = b => crypto.createHmac('sha256', TS).update(b).digest('base64url');
const sign = o => { const b = Buffer.from(JSON.stringify(o)).toString('base64url'); return b + '.' + mac(b); };
const read = t => {
  try {
    const [b, s] = String(t).split('.'); const e = mac(b);
    if (s.length !== e.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(e))) return null;
    return JSON.parse(Buffer.from(b, 'base64url'));
  } catch (x) { return null; }
};
const res = (code, obj, extra = {}) => ({ statusCode: code, headers: { 'Content-Type': 'application/json', ...extra }, body: JSON.stringify(obj) });
module.exports = { ps, sign, read, res };
