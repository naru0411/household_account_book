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

const QUICK_ITEMS = [
    { label: '家賃', amount: 65000, category: '住居費', note: '家賃固定費', type: 'expense' },
    { label: 'サブスク', amount: 1100, category: '娯楽', note: '定額サービス', type: 'expense' },
    { label: '水道光熱', amount: 12000, category: '光熱費', note: '月次目安', type: 'expense' },
    { label: '給与', amount: 250000, category: '給与', note: '本業', type: 'income' },
] as const;

export const TransactionForm: React.FC<Props> = ({ onAdd }) => {
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES.expense[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const evaluateFormula = (input: string) => {
        try {
            // 安全な計算: 数字と演算子のみ許可
            if (!/^[0-9+\-*/.() ]+$/.test(input)) return input;
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${input}`)();
            return isFinite(result) ? String(Math.round(result)) : input;
        } catch {
            return input;
        }
    };

    const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && /[+\-*/]/.test(amount)) {
            e.preventDefault();
            setAmount(evaluateFormula(amount));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = evaluateFormula(amount);
        if (!finalAmount || isNaN(Number(finalAmount))) return;

        onAdd({
            type,
            amount: Number(finalAmount),
            category,
            date,
            note
        });

        setAmount('');
        setNote('');
    };

    const handleQuickAdd = (item: typeof QUICK_ITEMS[number]) => {
        setType(item.type);
        setAmount(String(item.amount));
        setCategory(item.category);
        setNote(item.note);
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setCategory(CATEGORIES[newType][0]);
    };

    return (
        <div className="card form-container">
            <h3>新規登録</h3>

            <div className="quick-actions">
                <div className="quick-actions-title">クイック登録</div>
                {QUICK_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className="quick-btn"
                        onClick={() => handleQuickAdd(item)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

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
                    <label>金額 {amount.match(/[+\-*/]/) && <small>(Enterで計算)</small>}</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={handleAmountKeyDown}
                        placeholder="0 (例: 1200+500)"
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

                <button type="submit" className="submit-btn" disabled={!amount}>登録する</button>
            </form>
        </div>
    );
};
