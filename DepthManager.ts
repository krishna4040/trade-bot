export class DepthManager {
    private market: string;
    private bids!: {
        [key: string]: string
    };
    private asks!: {
        [key: string]: string
    };
    constructor(market: string) {
        this.market = market;
        setInterval(() => {
            this.pollMarket();
        }, 1000);
    }

    pollMarket = async () => {
        const res = await fetch(`https://public.coindcx.com/market_data/orderbook?pair=${this.market}`);
        const depth = await res.json();
        this.bids = depth?.bids;
        this.asks = depth?.asks;
    }

    getRelevantDepth = () => {
        let highestBid = -100;
        let lowestAsk = 10000000;
        Object.keys(this.bids).map(x => {
            if (parseFloat(x) > highestBid) {
                highestBid = parseFloat(this.bids[x]);
            }
        });
        Object.keys(this.asks).map(x => {
            if (parseFloat(x) < lowestAsk) {
                lowestAsk = parseFloat(this.asks[x]);
            }
        });
        return {
            highestBid,
            lowestAsk
        }
    }
}