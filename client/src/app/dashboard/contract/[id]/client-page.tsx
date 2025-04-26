// "use client"

// import ContractAnalysisResults from "@/components/analysis/contract-analysis-results"
// import { useCurrentUser } from "@/hooks/use-current-user"
// import { api } from "@/lib/api"
// import { notFound } from "next/navigation"
// import { useEffect, useState } from "react"
// import { useSubscription } from "@/hooks/use-subscription"

// export default function ClientContractPage({ id }: { id: string }) {
//   const { user } = useCurrentUser()
//   const [analysisResults, setAnalysisResults] = useState<any>()
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<boolean>(false)

//   const { subscriptionStatus } = useSubscription()
//   const isActive = subscriptionStatus ? subscriptionStatus.status === "active" : false

//   useEffect(() => {
//     if (user) {
//       fetchAnalysisResults(id)
//     }
//   }, [user, id])

//   const fetchAnalysisResults = async (contractId: string) => {
//     try {
//       setLoading(true)
//       const response = await api.get(`/contracts/contract/${contractId}`)
//       setAnalysisResults(response.data)
//       setError(false)
//     } catch (error) {
//       setError(true)
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (error) {
//     return notFound() // Return the notFound component in case of an error
//   }

//   if (loading) {
//     return <div>Loading...</div> // Display loading state
//   }

//   return <ContractAnalysisResults analysisResults={analysisResults} isActive={isActive} />
// }
