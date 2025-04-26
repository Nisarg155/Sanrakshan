// "use client";

    // import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
// import {useCurrentUser} from "@/hooks/use-current-user";
// // import {ContractAnalysis} from "@/interfaces/contract.interface";
// import {api} from "@/lib/api";
// import {notFound} from "next/navigation";
// import {useEffect, useState} from "react";
// import {useSubscription} from "@/hooks/use-subscription";

// interface ContractResultsProps {
//     contractId: string;
//   }
// export default function ContractResults({contractId }: ContractResultsProps) {
//     // const contractId = params.id;
//     const {user} = useCurrentUser();
//     const [analysisResults, setAnalysisResults] = useState<any>();
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<boolean>(false);

//     const {
//         subscriptionStatus,
//     } = useSubscription();

//     const isActive = subscriptionStatus ? subscriptionStatus.status === "active" : false;


//     useEffect(() => {
//         if (user) {
//             fetchAnalysisResults(contractId);
//         }
//     }, [user]);

//     const fetchAnalysisResults = async (id: string) => {
//         try {
//             setLoading(true);
//             const response = await api.get(`/contracts/contract/${id}`);
//             setAnalysisResults(response.data);
//             console.log(response.data);
//             setError(false);
//         } catch (error) {
//             console.error(error);
//             setError(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (error) {
//         return notFound();
//     }

//     if (!analysisResults) {
//         return <div>Loading...</div>;
//     }


//     return (
//         <ContractAnalysisResults
//             // contractId={contractId}
//             // analysisResults={analysisResults}
//             analysisResults={analysisResults}
//             isActive={isActive}
//             //   onUpgrade={function (): void {
//             //     throw new Error("Function not implemented.");
//             //   }}
//         />
//     );
// }