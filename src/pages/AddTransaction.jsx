import { useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import TransactionForm from "../components/TransactionForm.jsx";

function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  function handleAdd(transactionData) {
    addTransaction(transactionData);
    navigate("/");
  }

  return (
    <div className="page">
      <header className="page-heading dashboard-heading">
        <span className="eyebrow">Budget Tracker / new entry</span>
        <button
          type="button"
          className="btn-secondary back-dashboard-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </header>

      <div className="form-card">
        <TransactionForm onSubmit={handleAdd} submitLabel="Add Transaction" />
      </div>
    </div>
  );
}

export default AddTransaction;
