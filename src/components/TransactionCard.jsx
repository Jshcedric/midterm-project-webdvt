import { memo } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/format.js";

function TransactionCard({ transaction }) {
  const isIncome = transaction.type === "income";

  return (
    <Link to={`/transaction/${transaction.id}`} className="transaction-card">
      <div className={`transaction-icon ${isIncome ? "icon-income" : "icon-expense"}`}>
        {isIncome ? "↑" : "↓"}
      </div>

      <div className="transaction-main">
        <p className="transaction-title">{transaction.title}</p>
        <div className="transaction-meta">
          <span className="transaction-category">{transaction.category}</span>
          <span className="transaction-dot">•</span>
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>
      </div>

      <p className={`transaction-amount ${isIncome ? "amount-income" : "amount-expense"}`}>
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>
    </Link>
  );
}

export default memo(TransactionCard);
