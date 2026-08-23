import { useState } from "react";
import { getCategoriesForType } from "../data/categories.js";
import { formatCurrency, getTodayDateString } from "../utils/format.js";
import { getCategoryColor } from "../utils/categoryColors.js";

// Reusable for both "Add Transaction" and "Edit Transaction" (Phase 5).
// Pass `initialValues` to pre-fill the form when editing.
function TransactionForm({ initialValues, onSubmit, submitLabel = "Save Transaction" }) {
  const [values, setValues] = useState(
    initialValues || {
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: getTodayDateString(),
      description: "",
    }
  );

  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setValues((prev) => {
      // If the type changes, clear the category since the available
      // category options are different for income vs. expense.
      if (field === "type" && value !== prev.type) {
        return { ...prev, type: value, category: "" };
      }
      return { ...prev, [field]: value };
    });
  }

  function validate() {
    const newErrors = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (values.amount === "" || values.amount === null) {
      newErrors.amount = "Amount is required.";
    } else if (Number(values.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!values.type) {
      newErrors.type = "Type is required.";
    }

    if (!values.category) {
      newErrors.category = "Category is required.";
    }

    if (!values.date) {
      newErrors.date = "Date is required.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      amount: Number(values.amount),
      title: values.title.trim(),
      description: values.description.trim(),
    });
  }

  const categoryOptions = getCategoriesForType(values.type);

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">
          Title <span className="required-mark">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Lunch at school"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p className="form-error" id="title-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="amount">
            Amount (₱) <span className="required-mark">*</span>
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
          {errors.amount && (
            <p className="form-error" id="amount-error" role="alert">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="date">
            Date <span className="required-mark">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => handleChange("date", e.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined}
          />
          {errors.date && (
            <p className="form-error" id="date-error" role="alert">
              {errors.date}
            </p>
          )}
        </div>
      </div>

      <div className="form-field">
        <label id="type-label">
          Type <span className="required-mark">*</span>
        </label>
        <div className="type-toggle" role="group" aria-labelledby="type-label">
          <button
            type="button"
            className={`type-option ${values.type === "expense" ? "type-option-active-expense" : ""}`}
            aria-pressed={values.type === "expense"}
            onClick={() => handleChange("type", "expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-option ${values.type === "income" ? "type-option-active-income" : ""}`}
            aria-pressed={values.type === "income"}
            onClick={() => handleChange("type", "income")}
          >
            Income
          </button>
        </div>
        {errors.type && (
          <p className="form-error" role="alert">
            {errors.type}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="category">
          Category <span className="required-mark">*</span>
        </label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? "category-error" : undefined}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="form-error" id="category-error" role="alert">
            {errors.category}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Any extra notes..."
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="preview-card">
        <p className="preview-label">Preview</p>

        {values.title || values.amount || values.category ? (
          <div className="preview-row">
            <span
              className="preview-dot"
              style={{
                background: values.category
                  ? getCategoryColor(values.category)
                  : "var(--border)",
              }}
            />
            <div className="preview-info">
              <span className="preview-title">{values.title || "Untitled"}</span>
              <span className="preview-meta">
                {values.type === "income" ? "Income" : "Expense"}
                {values.category ? ` • ${values.category}` : ""}
              </span>
            </div>
            <span
              className={`preview-amount ${
                values.type === "income" ? "amount-income" : "amount-expense"
              }`}
            >
              {values.type === "income" ? "+" : "-"}
              {formatCurrency(values.amount || 0)}
            </span>
          </div>
        ) : (
          <p className="preview-empty">Fill in the details above to see a preview.</p>
        )}
      </div>

      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default TransactionForm;
