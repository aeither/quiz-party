import { useEffect } from 'react';
import { toast } from "sonner";
import { parseEther } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from "./ui/button";

const QUIZ_GENERATION_ADDRESS = '0x5052936D3c98d2d045da4995d37B0DaE80C6F07f';
const QUIZ_GENERATION_COST = '0.01';

interface PaymentButtonProps {
  onPaymentConfirmed: (txHash: string) => void;
}

export function PaymentButton({ onPaymentConfirmed }: PaymentButtonProps) {
  const { address } = useAccount();
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Send payment when button is clicked
  const handlePayment = async () => {
    try {
      sendTransaction({
        to: QUIZ_GENERATION_ADDRESS,
        value: parseEther(QUIZ_GENERATION_COST),
      });
    } catch (e) {
      console.error('Payment error:', e);
      toast.error('Failed to send payment');
    }
  };

  // When transaction is confirmed, notify parent
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

  return (
    <div className="space-y-4">
      <Button
        onClick={handlePayment}
        disabled={isPending || isConfirming}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {isPending ? 'Confirm in Wallet...' : 
         isConfirming ? 'Confirming Payment...' : 
         `Generate Quiz (${QUIZ_GENERATION_COST} ETH)`}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500">
          Error: {error.message || 'Failed to send payment'}
        </p>
      )}
    </div>
  );
} 