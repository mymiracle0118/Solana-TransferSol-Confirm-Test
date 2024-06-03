// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const reqData = JSON.parse(req.body)

  const url = "https://api-devnet.helius.xyz/v0/transactions/?api-key=5b1d8126-493d-445b-ab36-72666c95babb&commitment=confirmed";

  // console.log( reqData.signature );
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

  res.status(200).json({ message: data})
}
