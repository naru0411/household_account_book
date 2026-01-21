import React, { useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface Props {
    onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = {
    income: ['給与', '賞与', '副業', '臨時収入', 'その他'],
    expense: ['食費', '日用品', '住居費', '光熱費', '通信費', '交通費', '交際費', '娯楽', '美容・衣服', '医療', 'その他']
};

export const TransactionForm: React.FC<Props> = ({ onAdd }) => {
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES.expense[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        onAdd({
            type,
            amount: Number(amount),
            category,
            date,
            note
        });

        setAmount('');
        setNote('');
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setCategory(CATEGORIES[newType][0]);
    };

    return (
        <div className="card form-container">
            <h3>新規登録</h3>
            <form onSubmit={handleSubmit}>
                <div className="type-selector">
                    <button
                        type="button"
                        className={type === 'income' ? 'active income' : ''}
                        onClick={() => handleTypeChange('income')}
                    >
                        <PlusCircle size={18} /> 収入
                    </button>
                    <button
                        type="button"
                        className={type === 'expense' ? 'active expense' : ''}
                        onClick={() => handleTypeChange('expense')}
                    >
                        <MinusCircle size={18} /> 支出
                    </button>
                </div>

                <div className="form-group">
                    <label>金額</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>カテゴリ</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES[type].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>メモ</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="内容をメモ..."
                    />
                </div>

                <button type="submit" className="submit-btn">登録する</button>
            </form>
        </div>
    );
};
