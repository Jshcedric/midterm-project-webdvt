import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import TransactionForm from "../components/TransactionForm.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransactionById, updateTransaction, deleteTransaction } = useTransactions();

  const [isEditing, setIsEditing] = useState(false);

  const transaction = getTransactionById(id);

  // ---- Not found state ----
  if (!transaction) {
    return (
      <div className="page">
        <div className="not-found-card">
          <h1 className="page-title">Transaction Not Found</h1>
          <p className="page-subtitle">
            We couldn't find a transaction with that ID. It may have already
            been deleted.
          </p>
          <Link to="/" className="btn-primary btn-inline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isIncome = transaction.type === "income";

  function handleUpdate(updatedData) {
    updateTransaction(id, updatedData);
    setIsEditing(false);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${transaction.title}"? This cannot be undone.`
    );
    if (confirmed) {
      deleteTransaction(id);
      navigate("/");
    }
  }

  // ---- Edit mode ----
  if (isEditing) {
    return (
      <div className="page">
        <h1 className="page-title">Edit Transaction</h1>
        <div className="form-card">
          <TransactionForm
            initialValues={{
              title: transaction.title,
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              date: transaction.date,
              description: transaction.description || "",
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
          <button className="btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---- View mode ----
  return (
    <div className="page">
      <h1 className="page-title">Transaction Detail</h1>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <p className="detail-title">{transaction.title}</p>
            <span className={`type-badge ${isIncome ? "type-badge-income" : "type-badge-expense"}`}>
              {isIncome ? "Income" : "Expense"}
            </span>
          </div>
          <p className={`detail-amount ${isIncome ? "amount-income" : "amount-expense"}`}>
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="detail-rows">
          <div className="detail-row">
            <span className="detail-label">Category</span>
            <span className="detail-value">{transaction.category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(transaction.date)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">
              {transaction.description || "No description provided."}
            </span>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <Link to="/" className="btn-secondary btn-inline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;
