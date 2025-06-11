"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import EmptyState from "@/components/analysis/empty-state";
import { useSubscription } from "@/hooks/use-subscription";
import { useContractStore } from "@/store/zustand";

export default function ContractResultsPage() {
  const analysisResults = useContractStore((state) => state.analysisrResults);

  const {
    subscriptionStatus,
  } = useSubscription();

  if (!subscriptionStatus) {
    return <div>Loading...</div>;
  }

  const isActive = subscriptionStatus ? subscriptionStatus.status === "active"  : false ;

  if (!analysisResults) {
    return <EmptyState title="No Analysis" description="Please try again" />;
  }
  console.log("I am result", analysisResults);
    
  return (
    <ContractAnalysisResults
      id={analysisResults._id}
      isActive={isActive}
    />
  );
}