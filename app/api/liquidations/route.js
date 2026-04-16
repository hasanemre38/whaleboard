const SYMBOLS = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT','LINKUSDT','DOTUSDT'];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      SYMBOLS.map(s =>
        fetch(`https://fapi.binance.com/fapi/v1/allForceOrders?symbol=${s}&limit=10`, { cache: 'no-store' })
          .then(r => r.json())
      )
    );

    const all = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        r.value.forEach(liq => {
          all.push({
            sym: SYMBOLS[i].replace('USDT',''),
            side: liq.side === 'BUY' ? 'LONG LİKİDASYON' : 'SHORT LİKİDASYON',
            dir: liq.side === 'BUY' ? 'LONG' : 'SHORT',
            price: parseFloat(liq.price),
            qty: parseFloat(liq.origQty),
            usd: parseFloat(liq.price) * parseFloat(liq.origQty),
            time: new Date(liq.time).toLocaleTimeString('tr-TR'),
            ts: liq.time,
          });
        });
      }
    });

    all.sort((a, b) => b.ts - a.ts);
    const totalLong = all.filter(l => l.dir === 'LONG').reduce((s, l) => s + l.usd, 0);
    const totalShort = all.filter(l => l.dir === 'SHORT').reduce((s, l) => s + l.usd, 0);

    return Response.json({ ok: true, liquidations: all.slice(0, 30), totalLong, totalShort });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
