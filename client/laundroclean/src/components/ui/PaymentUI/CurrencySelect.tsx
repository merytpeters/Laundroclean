import { Currency } from 'src/types/laundrocleanServices/laundroservices';
import styles from './CurrencySelector.module.css';

const CURRENCIES = [
    { code: 'USD', symbol: '$', name: "DOLLAR" },
    { code: 'GBP', symbol: '£', name: "POUNDS" },
    { code: 'NGN', symbol: '₦', name: "NAIRA" },
]

interface CurrencySelectProps {
    currentCurrency: Currency;
    onCurrencyChange: (newCurrency: Currency) => void;
    className?: string;
    id?: string;
}


export default function CurrencySelect({
    currentCurrency,
    onCurrencyChange,
    className = "",
    id = "currency-select",
}: CurrencySelectProps) {
    return (
        <div className={`${styles.currencySelectWrapper} ${className}`}>
            <label htmlFor="global-currency-select">
                Select Currency
            </label>
            <select 
                name=""
                id={id}
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
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