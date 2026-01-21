import type { Transaction } from '../types';

const STORAGE_KEY = 'household_account_transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const loadTransactions = (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse transactions from local storage', e);
        return [];
    }
};

export const exportToCSV = (transactions: Transaction[]): void => {
    const headers = ['ID', 'Type', 'Amount', 'Category', 'Date', 'Note'];
    const rows = transactions.map(t => [
        t.id,
        t.type,
        t.amount.toString(),
        t.category,
        t.date,
        t.note
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
