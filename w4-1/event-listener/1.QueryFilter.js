// https://wtf.academy/ether-start/Event/

import { goerliProvider } from "./common/providers.js";
import { ethers } from "ethers";

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

// WETH合约地址（goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6';

const contract = new ethers.Contract(addressWETH, abiWETH, goerliProvider);


// 得到当前block
const block = await goerliProvider.getBlockNumber();
console.log(`当前区块高度: ${block}`);
console.log(`打印事件详情:`);

// https://docs.ethers.org/v5/api/contract/contract/#Contract-queryFilter
const transferEvents = await contract.queryFilter('Transfer', block - 10, block);
// 打印第1个Transfer事件
console.log(transferEvents[0]);


// 解析Transfer事件的数据（变量在args中）
console.log("\n2. 解析事件：")
const amount = ethers.utils.formatUnits(ethers.BigNumber.from(transferEvents[0].args["amount"]), "ether");
console.log(`地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)


