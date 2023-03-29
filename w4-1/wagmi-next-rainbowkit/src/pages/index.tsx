import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Account, Vault } from '../components'

function Page() {
  const { isConnected } = useAccount()
  return (
    <>
      <h2>wagmi + RainbowKit + Next.js</h2>

      <ConnectButton />
      {isConnected && <Account />}
      {isConnected && <Vault />}
    </>
  )
}

export default Page
