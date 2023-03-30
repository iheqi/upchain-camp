import { BigNumber, ethers } from 'ethers'

import {
  useErc20BalanceOf
} from '../generated'

const vaultAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// 金库余额展示组件


export default function VaultBalance({ address }: any) {
  // 第 1 种方式：使用原钩子
  // const { data: vaultBalance, error, isLoading } = useContractRead({
  //   address: address,
  //   abi: vaultAbi,
  //   functionName: 'balanceOf',
  //   args: [address]
  // })

  // 第 2 种方式：使用插件封装后的钩子

  const { data: balance, isLoading } = useErc20BalanceOf({
    address: vaultAddress,
    args: address ? [address] : undefined,
    watch: true, // 加了watch会自动更新
  })

  if (isLoading) {
    return (
      <p>
        <span>您的金库余额：Loading</span> 
      </p>
    )
  }

  return (
    <p>
      <span>您的金库余额：{ethers.utils.formatUnits(balance as BigNumber, 0)}</span> 
    </p>
  )
}