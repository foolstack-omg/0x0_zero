"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import{ useState } from 'react';


import {
  useChainId,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useBalance,
  useNetwork, useSwitchNetwork,
  
} from 'wagmi';
import abiAvailFaucet from "@/abis/avail-faucet"
import React from 'react';

const CONTRACT_AVAIL_FAUCET = "0xeA1A9A530d630C3999aEaF624ec643AfAfDb71D9"
const contractConfig = {
  address: CONTRACT_AVAIL_FAUCET,
  abi: abiAvailFaucet,
};
const Home = () => {
  const { chain: currentChain } = useNetwork();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { toast } = useToast()
  const { isConnected, address } = useAccount();
  console.log(address)
  const [mounted, setMounted] = React.useState(false);
  const { data: balance, isError, isLoading } = useBalance({
    address: address,
    watch: true
  })
  // const balance = useBalance({
  //   address: address,
  //   formatUnits: 'ether',
  //   watch: true
  // });
  React.useEffect(() => setMounted(true), []);

  let chainId = useChainId()
  console.log(chainId)

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => { // 注意这里接收的是直接的input值，不再是事件对象
    console.log(event.target.value)
      setInputValue(event.target.value);
  }


  // console.log(contractWriteConfig)

  

  // const { data: minted } = useContractRead({
  //   ...contractConfig,
  //   args: [address],
  //   functionName: 'balanceOf',
  //   watch: true,
  // });

  // console.log(minted)

  // React.useEffect(() => {
    
  //  console.log(totalSupplyData)
  // }, [totalSupplyData]);
  // const {
  //   data: signature,
  //   signMessage,
  //   reset: resetSignature
  // } = useSignMessage({
  //   onSuccess: (data, variables) => {
      
  //   },
  // })

  
  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    args: [1, inputValue],
    functionName: 'swapFaucet',
    value: '500000000000000'
  });
  const {
    data: mintData,
    write: swapFaucet,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    reset: resetWrite,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

 
  
  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  let isTransfered = txSuccess;
  React.useEffect(() => {
    console.log(`transfered.'`, txData)
    if(isTransfered) {  
      toast({
        title: "Success",
        description: txData?.blockHash,
        action: (
          <ToastAction altText="Success">Ok</ToastAction>
        ),
      })
      resetWrite()
      resetSignature()
    }
  }, [isTransfered]);

  return (
    <div className={styles.container}>
      
      <Head>
        <title>⚡️0x0_zero⚡️'s TookKit</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
       
        <h1 className={styles.title}>
          AVL Faucet Swap
        </h1>

        <p className={styles.description}>
        <code className={styles.code}>{ 'Swap to get AVL about 1 minutes later. '}</code>
        </p>
        <p className={styles.description}>
        <code className={styles.code}>{ '0.0005ETH = 0.1AVL'}</code>
        </p>
        {/* <p className={styles.description}>
        <code className={styles.code}>{ balance?.formatted == 0 && currentChain?.id == 42161 && '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'}</code>
        </p> */}

        <p>
        <Input style={{width: '600px', marginBottom: '20px'}} type="email" placeholder="Please input your Avail Address" value={inputValue} onChange={handleInputChange}/>

        </p>
       
        {mounted && isConnected && currentChain?.id == 42161 && (
          <Button onClick={() => {
            swapFaucet?.()
          }}>
             { `Swap`}
          </Button>
        )}
        {currentChain?.id != 42161 && (
          <p className={styles.description} >
          <code className={styles.code}>Please switch to Arbitrum Network. </code>
          </p>
        )}

      {/* <p className={styles.description} >
        <code className={styles.code}>Minted: {minted?.toString()}</code>
        </p> */}
      </main>

      <footer className={styles.footer}>
        <a href="https://twitter.com/0x0_zero" rel="noopener noreferrer" target="_blank">
           ⚡️ <b > 0x0 </b>  ⚡️
        </a>
      </footer>
      <Toaster />
    </div>
     
  )
}

export default Home
