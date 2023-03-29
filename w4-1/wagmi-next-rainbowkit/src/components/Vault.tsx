import { useEffect } from 'react'
import { useAccount } from 'wagmi'

function getBalance() {
  
}

export function Vault() {
  const { address, isConnected } = useAccount()

  useEffect(() => {

  }, [address, isConnected])
  return (
    <>
      <h2>Vault</h2>

      <p>
        <span>您的余额：</span> 
      </p>
    </>
  )
}
