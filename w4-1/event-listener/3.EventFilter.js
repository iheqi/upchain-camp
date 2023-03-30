import { goerliProvider, mainnetProvider } from "./common/providers.js";
import { ethers } from "ethers";

// USDT的合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
// 交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60';

// 构建USDT的Transfer的ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];

// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, mainnetProvider);


const balanceUSDT = await contractUSDT.balanceOf(accountBinance);
console.log(`1.币安热钱包USDT余额: ${ethers.utils.formatUnits(ethers.BigNumber.from(balanceUSDT), 6)}\n`);

console.log("\n2. 创建过滤器，监听转移USDT进交易所");

const filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance); // 带有过滤的事件搜索，这里没有指定区块范围？
console.log("过滤器详情：\n", filterBinanceIn);

// 半天监听不到入金
contractUSDT.on(filterBinanceIn, (from, to, value) => {
  console.log('---------监听USDT进入交易所--------');
  console.log(
    `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value), 6)}`
  )
}).on('error', (error) => {
  console.log(error);
})

const filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance, null);
console.log("\n3. 创建过滤器，监听转移USDT出交易所");
console.log("过滤器详情：", filterToBinanceOut)
contractUSDT.on(filterToBinanceOut, (from, to, value) => {
  console.log('---------监听USDT转出交易所--------');
  console.log(
    `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value), 6)}`
  )
}
).on('error', (error) => {
  console.log(error);
});