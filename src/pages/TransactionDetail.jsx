import { useParams } from "react-router-dom";

function TransactionDetail() {
  // useParams() reads the ":id" part of the URL, e.g. /transaction/123 -> id = "123"
  const { id } = useParams();

  return (
    <div className="page">
      <h1 className="page-title">Transaction Detail</h1>
      <p className="page-subtitle">
        Showing details for transaction ID: <strong>{id}</strong>
      </p>
      <p className="page-subtitle">
        Full details, edit, and delete functionality will be built in Phase 5.
      </p>

      <div className="placeholder-card">Transaction details go here</div>
    </div>
  );
}

export default TransactionDetail;
