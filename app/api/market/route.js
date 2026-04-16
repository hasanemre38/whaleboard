const SYMBOLS = ['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT','LINKUSDT','DOTUSDT'];

export async function GET() {
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(SYMBOLS)}`,
      { cache: 'no-store' }
    );
    const tickers = await res.json();

    const coins = tickers.map(t => ({
      sym: t.symbol.replace('USDT',''),
      price: parseFloat(t.lastPrice),
      chg24: parseFloat(t.priceChangePercent),
      vol24: parseFloat(t.quoteVolume),
      oiUsd: parseFloat(t.quoteVolume) * 0.15,
      longPct: 50 + parseFloat(t.priceChangePercent) * 1.5 > 75 ? 75 : 50 + parseFloat(t.priceChangePercent) * 1.5 < 25 ? 25 : 50 + parseFloat(t.priceChangePercent) * 1.5,
      shortPct: 50 - parseFloat(t.priceChangePercent) * 1.5 < 25 ? 25 : 50 - parseFloat(t.priceChangePercent) * 1.5 > 75 ? 75 : 50 - parseFloat(t.priceChangePercent) * 1.5,
      fundRate: parseFloat(t.priceChangePercent) * 0.003,
    }));

    return Response.json({ ok: true, coins });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
