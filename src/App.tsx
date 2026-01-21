import { useState, useEffect } from 'react';
import type { Transaction } from './types';
import { loadTransactions, saveTransactions, exportToCSV } from './utils/storage';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Dashboard } from './components/Dashboard';
import { Download } from 'lucide-react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app">
      <header>
        <h1>Smart Ledger</h1>
        <button className="export-btn" onClick={() => exportToCSV(transactions)}>
          <Download size={18} /> データ出力 (CSV)
        </button>
      </header>

      <main>
        <Dashboard transactions={transactions} />

        <div className="main-grid" style={{ marginTop: '2rem' }}>
          <TransactionForm onAdd={handleAddTransaction} />
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
