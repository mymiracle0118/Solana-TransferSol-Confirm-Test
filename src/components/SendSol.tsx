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
      const amount = BigInt(form.amount * Math.pow(10, form.decimals));
      console.log(amount)
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
        // Sign transaction, broadcast, and confirm
        // const signature = await sendAndConfirmTransaction(
        //     connection,
        //     transaction,
        //     []
        // );
        // console.log("SIGNATURE", signature);
        // console.log("SUCCESS");
        signature = await sendTransaction(transaction, connection, {signers: []});
        notify({ type: 'success', message: 'Transaction successful!', txid: signature });
          // const lamports = await getMinimumBalanceForRentExemptMint(connection);
          // const mintKeypair = Keypair.generate();
          // const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);
          // const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
          //   {
          //     metadata: PublicKey.findProgramAddressSync(
          //       [
          //         Buffer.from("metadata"),
          //         PROGRAM_ID.toBuffer(),
          //         mintKeypair.publicKey.toBuffer(),
          //       ],
          //       PROGRAM_ID,
          //     )[0],
          //     mint: mintKeypair.publicKey,
          //     mintAuthority: publicKey,
          //     payer: publicKey,
          //     updateAuthority: publicKey,
          //   },
          //   {
          //     createMetadataAccountArgsV3: {
          //       data: {
          //         name: form.receiveAddress,
          //         symbol: form.symbol,
          //         uri: form.metadata,
          //         creators: null,
          //         sellerFeeBasisPoints: 0,
          //         uses: null,
          //         collection: null,
          //       },
          //       isMutable: true,
          //       collectionDetails: null,
          //     },
          //   },
          // );

          // const createNewTokenTransaction = new Transaction().add(
          //   SystemProgram.createAccount({
          //       fromPubkey: publicKey,
          //       newAccountPubkey: mintKeypair.publicKey,
          //       space: MINT_SIZE,
          //       lamports: lamports,
          //       programId: TOKEN_PROGRAM_ID,
          //   }),
          //   createInitializeMintInstruction(
          //     mintKeypair.publicKey, 
          //     form.decimals, 
          //     publicKey, 
          //     publicKey, 
          //     TOKEN_PROGRAM_ID),
          //   createAssociatedTokenAccountInstruction(
          //     publicKey,
          //     tokenATA,
          //     publicKey,
          //     mintKeypair.publicKey,
          //   ),
          //   createMintToInstruction(
          //     mintKeypair.publicKey,
          //     tokenATA,
          //     publicKey,
          //     amount
          //   ),
          //   createMetadataInstruction
          // );
          // signature = await sendTransaction(createNewTokenTransaction, connection, {signers: [mintKeypair]});
          // notify({ type: 'success', message: 'Transaction successful!', txid: signature });
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
