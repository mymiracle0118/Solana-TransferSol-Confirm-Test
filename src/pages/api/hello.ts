// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: string,
  message: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const reqData = JSON.parse(req.body)

  const url = "https://api-devnet.helius.xyz/v0/transactions/?api-key=5b1d8126-493d-445b-ab36-72666c95babb&commitment=confirmed";

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // transactions: ["nCQBkuX1M4asuPMS2nfjadvkR91i1Ac72esUdRZ5YUnqSZCkFvXpqxaS3439MWYLcAvUr5oZHSmgMJe2vRhQx7L"]
      transactions: [reqData.signature],
    }),
  });

  const data = await response.json();

  let result = [];
  if( String(data[0].nativeTransfers[0].fromUserAccount) !== String(reqData.from) ) result.push(`From Address is not valid ${reqData.from}:  ${data[0].nativeTransfers[0].fromUserAccount}`);
  if( String(data[0].nativeTransfers[0].toUserAccount) !== String(reqData.to) ) result.push(`To Address is not valid ${reqData.to}:  ${data[0].nativeTransfers[0].toUserAccount}`);
  if( Number(data[0].nativeTransfers[0].amount) !== Number(reqData.amount) ) result.push(`Amount is not valid ${reqData.amount}:  ${data[0].nativeTransfers[0].amount}`);
  
  if( result.length != 0 )
    return res.status(500).json({ status: "Not verified", message: result})
  res.status(200).json({ status: "Verified", message: ["Successfully verified!"]});
}
