import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  // const { data: ensName } = useEnsName({ address }) // hardhat 不支持 ens

  return (
    <p>
      {address ? ` (${address})` : null}
    </p>
  )
}
