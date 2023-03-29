import { BigNumber, ethers } from 'ethers'
import { useCallback } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import erc20GaGaAbi from '../abi/GaGa.json'
import vaultAbi from '../abi/Vault.json'

const gagaAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const vaultAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export function Vault() {
  const { address, isConnected } = useAccount()

  return (
    <>
      <h2>Vault</h2>
      <GaGaBalance address={address}/>
      <VaultBalance address={address}/>
    </>
  )
}

function GaGaBalance({ address }: any) {
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: gagaAddress,
    abi: erc20GaGaAbi,
    functionName: 'balanceOf',
    args: [address]
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
    // refetchBalance()
  }, [])

  return (
    <p>
      <span>您的 GaGa 币余额：{ethers.utils.formatUnits(balance as BigNumber, 0)}</span> 
      <button type='button' onClick={mint}>Mint：10000</button>
    </p>
  )
}

function VaultBalance({ address }: any) {
  const { data: vaultBalance, error, isLoading } = useContractRead({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: [address]
  })


  const { config } = usePrepareContractWrite({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: 'mint',
    args: [10000]
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
      <span>您的金库余额：{ethers.utils.formatUnits(vaultBalance as BigNumber, 0)}</span> 
    </p>
  )
}