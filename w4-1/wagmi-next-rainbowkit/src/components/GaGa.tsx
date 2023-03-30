import { BigNumber, ethers } from 'ethers'
import erc20GaGaAbi from '../abi/GaGa.json'
import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import {
  useErc20BalanceOf
} from '../generated'

const gagaAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';


// 代币组件
export default function GaGa({ address }: any) {
  // const { data: balance, refetch: refetchBalance } = useContractRead({
  //   address: gagaAddress,
  //   abi: erc20GaGaAbi,
  //   functionName: 'balanceOf',
  //   args: [address]
  // })  

  const { data: balance, isLoading } = useErc20BalanceOf({
    address: gagaAddress,
    args: address ? [address] : undefined,
    watch: true, // 加了watch会自动更新
  })

  const { config } = usePrepareContractWrite({
    address: gagaAddress,
    abi: erc20GaGaAbi,
    functionName: 'mint',
    args: [10000]
  })

  const { write } = useContractWrite(config)

  const mint = useCallback(() => {
    write?.()
  }, [])

  return (
    <p>
      <span>您的 GaGa 币余额：{ethers.utils.formatUnits(balance as BigNumber, 0)}</span> 
      <button type='button' onClick={() => mint()}>Mint：10000</button>
    </p>
  )
}