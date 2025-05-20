import { useEffect } from 'react';
import { toast } from "sonner";
import { parseEther } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Button } from "./ui/button";

const QUIZ_CONTRACT_ADDRESS = '0x7d063d7735861EB49b092A7430efa1ae3Ac4F6F5';
const QUIZ_ABI = [
  {
    "inputs": [],
    "name": "payForQuiz",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "payer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentReceived",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "QUIZ_COST",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface PaymentButtonProps {
  onPaymentConfirmed: (txHash: string) => void;
}

export function PaymentButton({ onPaymentConfirmed }: PaymentButtonProps) {
  const { address } = useAccount();
  const {
    data: hash,
    isPending,
    error,
    writeContract
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && hash) {
      onPaymentConfirmed(hash);
      toast.success('Payment confirmed! Generating quiz...');
    }
  }, [isConfirmed, hash, onPaymentConfirmed]);

  if (!address) {
    return (
      <Button disabled className="w-full">
        Connect Wallet to Generate Quiz
      </Button>
    );
  }

  const handlePay = () => {
    writeContract({
      address: QUIZ_CONTRACT_ADDRESS,
      abi: QUIZ_ABI,
      functionName: 'payForQuiz',
      value: parseEther('0.01'),
    });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handlePay}
        disabled={isPending || isConfirming}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {isPending ? 'Confirm in Wallet...' :
         isConfirming ? 'Confirming Payment...' :
         `Generate Quiz (0.01 ETH)`}
      </Button>
      {error && (
        <p className="text-sm text-red-500">
          Error: {error.message || 'Failed to send payment'}
        </p>
      )}
    </div>
  );
} 