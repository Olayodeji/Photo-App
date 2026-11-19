// Estimate only: how much one naira is worth in the visitor's own currency.
const { M, res } = require('../lib');
exports.handler = async e => {
  try {
    const geo = JSON.parse(Buffer.from(e.headers['x-nf-geo'] || 'e30=', 'base64').toString());
    const currency = M[(geo.country && geo.country.code) || ''];
    if (!currency) return res(200, {});
    const r = await (await fetch('https://open.er-api.com/v6/latest/NGN')).json();
    const rate = r.rates && r.rates[currency];
    if (!rate) return res(200, {});
    return res(200, { currency, rate }, { 'Cache-Control': 'private, max-age=3600' });
  } catch (x) { return res(200, {}); }
};
