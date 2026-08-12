import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";
import TransactionDetail from "./pages/TransactionDetail.jsx";
import Summary from "./pages/Summary.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
