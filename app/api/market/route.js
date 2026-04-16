const SYMBOLS = ['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT','LINKUSDT','DOTUSDT'];

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [tickers, fundingRates] = await Promise.all([
      fetchJSON(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(SYMBOLS)}`),
      fetchJSON('https://fapi.binance.com/fapi/v1/premiumIndex'),
    ]);

    const oiResults = await Promise.allSettled(
      SYMBOLS.map(s => fetchJSON(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${s}`))
    );

    const lsResults = await Promise.allSettled(
      SYMBOLS.map(s =>
        fetchJSON(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${s}&period=5m&limit=1`)
      )
    );

    const fundMap = {};
    fundingRates.forEach(f => {
      if (SYMBOLS.includes(f.symbol)) {
        fundMap[f.symbol] = { rate: parseFloat(f.lastFundingRate) };
      }
    });

    const coins = tickers.map((t, i) => {
      const price = parseFloat(t.lastPrice);
      const oiRaw = oiResults[i].status === 'fulfilled' ? parseFloat(oiResults[i].value.openInterest) : 0;
      const lsData = lsResults[i].status === 'fulfilled' ? lsResults[i].value[0] : null;
      const fund = fundMap[t.symbol] || { rate: 0.0001 };
      return {
        sym: t.symbol.replace('USDT', ''),
        price,
        chg24: parseFloat(t.priceChangePercent),
        vol24: parseFloat(t.quoteVolume),
        oiUsd: oiRaw * price,
        longPct: lsData ? parseFloat(lsData.longAccount) * 100 : 50,
        shortPct: lsData ? parseFloat(lsData.shortAccount) * 100 : 50,
        fundRate: fund.rate * 100,
      };
    });

    return Response.json({ ok: true, coins });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
