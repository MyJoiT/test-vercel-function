import { NextRequest } from 'next/server'
import { ethers } from 'ethers'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

const storageRegistryContract = '0x6Df43106F7A4Ba0D1e9653eDA49530333A6B2D98';
const apiKey = 'FN1veTXn6WMxLcRoFWCeOqG-M60KxCCU'
const provider = new ethers.AlchemyProvider(10, apiKey)

const abi = [
  'function getBuyPrice(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getSellPrice(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getBuyPriceAfterFee(uint256 creatorId,uint256 amount) external view returns (uint256)',
  'function getSellPriceAfterFee(uint256 creatorId,uint256 amount) external view returns (uint256)'
]

const market = new ethers.Contract(storageRegistryContract, abi, provider)

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

const getBuyPrice = async (creatorId: number, amount: number) => {
  return await market.getBuyPrice(creatorId, amount)
}

const getSellPrice = async (creatorId: number, amount: number) => {
  return await market.getSellPrice(creatorId, amount)
}

const getBuyPriceAfterFee = async (creatorId: number, amount: number) => {
  return await market.getBuyPriceAfterFee(creatorId, amount)
}

const getSellPriceAfterFee = async (creatorId: number, amount: number) => {
  return await market.getSellPriceAfterFee(creatorId, amount)
}

interface IProof {
    timestamp: number,
    name: string,
    owner: string,
    signature: string,
    fid: number,
    type: string
}

const getFidByUsername = async (name: string) => {
  const api = `https://nemes.farcaster.xyz:2281/v1/userNameProofByName?name=${ name }`
  const proof = await fetch(api)
  const proofJson = await proof.json() as IProof
  return proofJson.fid
}

const getAvatarByFid = async (fid: number) => {
  const api = `https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${ fid }&user_data_type=1`
  const response = await fetch(api)
  const userData = await response.json()
  return userData.data.userDataBody.value
}

export async function GET(request: NextRequest) {
  const price = await getBuyPrice(12449, 1)
  console.log('price is: ', price)

  const afterfee = await getBuyPriceAfterFee(12449, 1)
  console.log('afterfee is: ', afterfee)

  const fid = await getFidByUsername('joit')
  console.log('fid: ', fid)

  const avatar = await getAvatarByFid(fid)
  console.log('avatar is: ', avatar)

  return new Response(
    '{"result": "ok"}',
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json' 
      },
    }
  );
}

// export async function POST(request: NextRequest) {
//   const unitPrice = await getFarcasterStorageUnitPrice()
// 
//   const txData = {
//     chainId: "eip155:10",
//     method: "eth_sendTransaction",
//     params: {
//       abi: jsonAbi,
//       to: "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D",
//       data: "0x783a112b00000000000000000000000000000000000000000000000000000000000030a10000000000000000000000000000000000000000000000000000000000000001",
//       value: unitPrice.toString(),
//     },
//   };
// 
//   return new Response(
//     JSON.stringify(txData),
//     {
//       status: 200,
//       headers: { 
//         'Content-Type': 'application/json' 
//       },
//     }
//   );
// }
