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
const mac = id => crypto.createHmac('sha256', TS).update('key:' + id).digest('hex').slice(0, 10);
// Short access key, e.g. xnxdt-6s1zg-1f4nx-f0b8c-902af (customer id + 10-character signature)
const keyOf = code => { const id = String(code).replace(/^CUS_/i, '').toLowerCase(); return (id + mac(id)).match(/.{1,5}/g).join('-'); };
const codeOf = key => {
  const a = String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a.length < 14) return null;
  const id = a.slice(0, -10), m = a.slice(-10), e = mac(id);
  return crypto.timingSafeEqual(Buffer.from(m), Buffer.from(e)) ? 'CUS_' + id : null;
};
const res = (code, obj, extra = {}) => ({ statusCode: code, headers: { 'Content-Type': 'application/json', ...extra }, body: JSON.stringify(obj) });
module.exports = { ps, keyOf, codeOf, res };
