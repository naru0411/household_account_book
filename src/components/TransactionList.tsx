import React from 'react';
import type { Transaction } from '../types';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Props {
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="card list-container">
            <h3>取引履歴</h3>
            {sortedTransactions.length === 0 ? (
                <p className="empty-message">データがありません</p>
            ) : (
                <div className="list-scroll">
                    {sortedTransactions.map(t => (
                        <div key={t.id} className="transaction-item">
                            <div className="item-icon">
                                {t.type === 'income' ? (
                                    <ArrowUpCircle className="income-icon" />
                                ) : (
                                    <ArrowDownCircle className="expense-icon" />
                                )}
                            </div>
                            <div className="item-info">
                                <div className="item-top">
                                    <span className="category">{t.category}</span>
                                    <span className={`amount ${t.type}`}>
                                        {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="item-bottom">
                                    <span className="date">{t.date}</span>
                                    {t.note && <span className="note">({t.note})</span>}
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => onDelete(t.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
