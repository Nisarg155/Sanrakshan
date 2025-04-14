import { Suspense } from "react"
import { notFound } from "next/navigation"
import ContractAnalysisResults from "@/components/analysis/contract-analysis-results"

// Use a server component that directly handles everything
export default async function ContractPage({ params }: any) {
  try {
    // You can fetch data directly in the server component
    // This is just a placeholder - replace with your actual data fetching logic
    const response = await fetch(`/api/contracts/contract/${params.id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return notFound()
    }

    const analysisResults = await response.json()

    // You'll need to handle the subscription status differently in a server component
    // This is just a placeholder
    const isActive = true // Replace with actual logic

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ContractAnalysisResults analysisResults={analysisResults} isActive={isActive} />
      </Suspense>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
