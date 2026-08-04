import styles from './CurrencySelector.module.css';

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: "DOLLAR" },
    { code: 'GBP', symbol: '£', name: "POUNDS" },
    { code: 'NGN', symbol: '₦', name: "NAIRA" },
]

interface CurrencySelectProps {
    currentCurrency: string;
    onCurrencyChange: (newCurrency: string) => void;
    className?: string;
}


export default function CurrencySelect({
    currentCurrency,
    onCurrencyChange,
    className = ""
}: CurrencySelectProps) {
    return (
        <div className={`${styles.currencySelectWrapper} ${className}`}>
            <label htmlFor="global-currency-select">
                Select Currency
            </label>
            <select 
                name=""
                id="global-currency-select"
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className={styles.currencyDropdown}
                >
                    {CURRENCIES.map((currency) => (
                        <option value={currency.code} key={currency.code}>
                            {currency.code} ({currency.symbol}) - {currency.name}
                        </option>
                    ))}
                </select>
        </div>
    )
}