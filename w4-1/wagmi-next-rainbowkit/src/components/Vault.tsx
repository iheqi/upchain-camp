import { BigNumber } from 'ethers'
import { useState } from 'react'
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'

import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
} from '../generated'

import VaultBalance from './VaultBalance'
import GaGa from './GaGa'

import vaultAbi from '../abi/Vault.json'

const gagaAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const vaultAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const user1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export function Vault() {
  const { address, isConnected } = useAccount()

  return (
    <>
      <h2>Vault</h2>
      <GaGa address={address}/>
      <VaultBalance address={address}/>
      <Allowance address={address} contractAddress={gagaAddress} />
      <VaultDeposit />
      <VaultWithdraw />
    </>
  )
}




// 金库存款操作组件
function VaultDeposit() {

  const { config } = usePrepareContractWrite({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: 'deposit',
    args: [10000, user1]
  })

  const { write } = useContractWrite(config)
  return (
    <p>
      <button onClick={() => write?.()}>存入10000 token</button> 
    </p>
  )
}

// 金库存款操作组件
function VaultWithdraw() {

  const { config } = usePrepareContractWrite({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: 'withdraw',
    args: [10000, user1, user1]
  })

  const { write } = useContractWrite(config)
  return (
    <p>
      <button onClick={() => write?.()}>取出10000 token</button> 
    </p>
  )
}


// 授权组件
function Allowance({
  address,
  contractAddress,
}: {
  address?: Address
  contractAddress: Address
}) {
  const [amount, setAmount] = useState('')
  const [spender, setSpender] = useState(
    vaultAddress as Address,
  )

  const { config, error, isError } = usePrepareErc20Approve({
    address: contractAddress,
    args: spender && amount ? [spender, BigNumber.from(amount)] : undefined,
    enabled: Boolean(spender && amount),
  })
  const { data, write } = useErc20Approve(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const { data: balance } = useErc20Allowance({
    address: contractAddress,
    args: address && spender ? [address, spender] : undefined,
    watch: true,
  })

  return (
    <div>
      <div>
        Spender:{' '}
        <input
          onChange={(e) => setSpender(e.target.value as Address)}
          placeholder="spender address"
          value={spender}
          style={{ width: 400 }}
        />
      </div>
      <div>
        Set Allowance:{' '}
        <input
          disabled={isLoading}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount (units)"
          value={amount}
        />
        <button disabled={isLoading && !write} onClick={() => write?.()}>
          set
        </button>
        {isLoading && <ProcessingMessage hash={data?.hash} />}
        {isSuccess && <div>Success!</div>}
        {isError && <div>Error: {error?.message}</div>}
      </div>
      <div>Allowance: {balance?.toString()}</div>
    </div>
  )
}



// 进度组件
function ProcessingMessage({ hash }: { hash?: `0x${string}` }) {
  const { chain } = useNetwork()
  const etherscan = chain?.blockExplorers?.etherscan
  return (
    <span>
      Processing transaction...{' '}
      {etherscan && (
        <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>
      )}
    </span>
  )
}