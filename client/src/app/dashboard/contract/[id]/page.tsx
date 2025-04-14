
import ContractResults from "./_components/contract-results";

interface PageProps  {
  params: { id: string };
}

export default function ContractPage({
  params
}:PageProps) {
  return <ContractResults contractId={params.id} />;
}