// Reads the monthly price from your Paystack plan, plus an estimate in the visitor's own currency.
const M = { NG:'NGN', GH:'GHS', KE:'KES', ZA:'ZAR', UG:'UGX', TZ:'TZS', RW:'RWF', GB:'GBP', CA:'CAD', AU:'AUD', NZ:'NZD', IN:'INR', AE:'AED', BR:'BRL', MX:'MXN', JP:'JPY', SG:'SGD', CH:'CHF', SE:'SEK', NO:'NOK', DK:'DKK', PH:'PHP', PK:'PKR', EG:'EGP', US:'USD' };
'DE FR IT ES NL BE IE PT AT FI GR LU'.split(' ').forEach(c => M[c] = 'EUR');
const { ps, res } = require('../lib');
exports.handler = async e => {
  try {
    const p = await ps('/plan/' + encodeURIComponent(process.env.PAYSTACK_PLAN_CODE));
    const amount = p.data.amount / 100, currency = p.data.currency || 'NGN';
    const out = { amount, currency };
    const geo = JSON.parse(Buffer.from(e.headers['x-nf-geo'] || 'e30=', 'base64').toString());
    const lc = M[(geo.country && geo.country.code) || ''];
    if (lc && lc !== currency) {
      const r = await (await fetch('https://open.er-api.com/v6/latest/' + currency)).json();
      const rate = r.rates && r.rates[lc];
      if (rate) out.local = { currency: lc, amount: amount * rate };
    }
    return res(200, out, { 'Cache-Control': 'private, max-age=900' });
  } catch (x) { return res(200, {}); }
};
