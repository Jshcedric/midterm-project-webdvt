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
      <h1 className="page-title">Add Transaction</h1>
      <p className="page-subtitle">
        Fill in the details below to record a new income or expense.
      </p>

      <div className="form-card">
        <TransactionForm onSubmit={handleAdd} submitLabel="Add Transaction" />
      </div>
    </div>
  );
}

export default AddTransaction;
