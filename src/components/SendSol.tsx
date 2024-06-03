import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionSignature, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { notify } from "../utils/notifications";
import base58 from 'bs58';

export const SendSol: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [receiveAddress, setReceiveAddress] = useState('')
  const [symbol, setSymbol] = useState('')
  const [metadata, setMetadata] = useState('')
  const [amount, setAmount] = useState('')
  const [decimals, setDecimals] = useState('')

  const onClick = useCallback(async (form) => {
      if (!publicKey) {
        notify({ type: 'error', message: `Wallet not connected!` });
        return;
      }
      let signature: TransactionSignature = '';
      try {
        // Add transfer instruction to transaction
        const receivePubKey = new PublicKey(receiveAddress);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: receivePubKey,
                lamports: LAMPORTS_PER_SOL / 10, // 0.1 sol
            })
        );
        
        console.log(receiveAddress);
        signature = await sendTransaction(transaction, connection, {signers: []});
        notify({ type: 'success', message: 'Transaction successful!', txid: signature });

        const resData = await fetch('/api/hello', {
          method: 'POST',
          body: JSON.stringify({
            signature
          })
        });

        const data = await resData.json();

        console.log(data)
        
      } catch (error: any) {
          notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
          return;
      }
  }, [publicKey, connection]);

  return (
    <div className="my-6">
      <input
        type="text"
        className="form-control block mb-2 w-full min-w-[400px] px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Receive Address"
        onChange={(e) => setReceiveAddress(e.target.value)}
      />
      
      {/* <input
        type="number"
        className="form-control block mb-2 w-full min-w-[400px] px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder="Decimals"
        onChange={(e) => setDecimals(e.target.value)}
      /> */}
      
      <button
        className="px-8 m-2 btn bg-purple-800 hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => onClick({decimals: Number(decimals), amount: Number(amount), metadata: metadata, symbol: symbol, receiveAddress: receiveAddress})}>
          <span>Send 0.1 Sol</span>
      </button>
    </div>
  )
}
