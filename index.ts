import chalk from "chalk";
import chalkAnimation from 'chalk-animation'
import { DepthManager } from "./DepthManager";
import { cancelAll, createOrder } from "./order";

const solInrMarket = new DepthManager("B-SOL_INR");
const usdtInrMarket = new DepthManager("B-USDT_INR");
const solUsdtMarket = new DepthManager("B-SOL_USDT");

setInterval(() => {
    console.log(chalk.red("SOL_INR_MARKET---->"), solInrMarket.getRelevantDepth());
    console.log(chalk.green("USDT_INR_MARKET---->"), usdtInrMarket.getRelevantDepth());
    console.log(chalk.blue("SOL_USDT_MARKET---->"), solUsdtMarket.getRelevantDepth());

    // sell SOL for INR, buy USDT from INR, buy SOL from INR
    // lets say u start with 1 sol

    const canGetInr = solInrMarket.getRelevantDepth().highestBid - 0.001;
    const canGetUsdt = canGetInr / usdtInrMarket.getRelevantDepth().lowestAsk;
    const canGetSol = canGetUsdt / solInrMarket.getRelevantDepth().lowestAsk;

    console.log(chalkAnimation.rainbow(`You can convert 1 SOL into ${canGetSol} SOL`));

    const initialInr = solInrMarket.getRelevantDepth().highestBid + 0.001;
    const canGetUsdt2 = solUsdtMarket.getRelevantDepth().highestBid;
    const canGetInr2 = usdtInrMarket.getRelevantDepth().highestBid / canGetUsdt2;

    console.log(`you converted ${initialInr} INR into ${canGetInr2} INR`);

}, 2000);

async function main() {
    const highestBid = solInrMarket.getRelevantDepth().highestBid;
    await createOrder("buy", "XAIINR", parseFloat((highestBid + 0.001).toFixed(3)), 1, Math.random().toString());
    await new Promise((r) => setTimeout(() => r, 10000));
    await cancelAll("XAIINR");
    await new Promise((r) => setTimeout(r, 1000));
    main();
}

setInterval(async () => {
    main();
}, 20000);