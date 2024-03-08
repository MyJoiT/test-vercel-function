import { NextRequest } from 'next/server'
import { ethers } from 'ethers'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

const storageRegistryContract = '0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D';
const apiKey = 'FN1veTXn6WMxLcRoFWCeOqG-M60KxCCU'
const provider = ethers.getDefaultProvider(10)

const abi = [
  'function unitPrice() external view returns (uint256)'
]

const jsonAbi = `
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "fid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "units",
				"type": "uint256"
			}
		],
		"name": "rent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "overpayment",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	}
]
`

const storage = new ethers.Contract(storageRegistryContract, abi, provider)

const getFarcasterStorageUnitPrice = async () => {
  return await storage.unitPrice()
}

export async function POST(request: NextRequest) {
  const unitPrice = await getFarcasterStorageUnitPrice()

  const txData = {
    chainId: "eip155:10",
    method: "eth_sendTransaction",
    params: {
      abi: jsonAbi,
      to: "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D",
      data: "0x783a112b00000000000000000000000000000000000000000000000000000000000030a10000000000000000000000000000000000000000000000000000000000000001",
      value: unitPrice.toString(),
    },
  };

  return new Response(
    JSON.stringify(txData),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json' 
      },
    }
  );
}
