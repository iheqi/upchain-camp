import { defineConfig } from '@wagmi/cli'
import { erc20ABI } from 'wagmi'

// https://wagmi.sh/cli/getting-started
export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
  ]
})