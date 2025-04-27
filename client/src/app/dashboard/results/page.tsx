"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import EmptyState from "@/components/analysis/empty-state";
import { useSubscription } from "@/hooks/use-subscription";

// import stripePromise from "@/lib/stripe";
import { useContractStore } from "@/store/zustand";
import { toast } from "sonner";

export default function ContractResultsPage() {
  const analysisResults = useContractStore((state) => state.analysisrResults);

  const {
    subscriptionStatus,
  } = useSubscription();

  if (!subscriptionStatus) {
    return <div>Loading...</div>;
  }

  const isActive = subscriptionStatus ? subscriptionStatus.status === "active"  : false ;

  // const handleUpgrade = async () => {
  //   setLoading(true);
  //   if (!isActive) {
  //     try {
  //       const response = await api.get("/payments/create-checkout-session");
  //       const stripe = await stripePromise;
  //       await stripe?.redirectToCheckout({
  //         sessionId: response.data.sessionId,
  //       });
  //     } catch (error) {
  //       toast.error("Please try again or login to your account");
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     toast.error("You are already a premium member");
  //   }
  // };

  if (!analysisResults) {
    return <EmptyState title="No Analysis" description="Please try again" />;
  }
  console.log("I am result", analysisResults);
    
  return (
    <ContractAnalysisResults
      id={analysisResults._id}
      isActive={isActive}
      // analysisResults={analysisResults}
      // onUpgrade={handleUpgrade}
    />
  );
}