import { FiSearch, FiChevronDown } from "react-icons/fi";
import styles from './SearchBar.module.css'

export function SearchBar() {
    return (
        <div role="searchbox" className={styles.searchbox}>
            <input type="search" name="search-box" id="searchbox" placeholder="Search..." />
            <FiSearch size={16} className={styles.searchicon} />
        </div>
    )
}

export function LocalSearchBar({ placeholder, placeHolder = 'Search...' }: { placeholder?: string; placeHolder?: string }) {
    const ph = placeholder ?? placeHolder
    return (
        <div role="searchbox" className={styles.localsearchbox}>
            <FiSearch size={16} className={styles.searchicon} />
            <input type="search" name="search-box" id="searchbox" placeholder={ph} />
        </div>
    )
}

type Option = { value: string; label: string }

export function FilterSearch({
    placeholder = 'Select...',
    options = [],
    multiple = false,
    name = 'filters',
    id,
}: {
    placeholder?: string
    options?: Option[]
    multiple?: boolean
    name?: string
    id?: string
}) {
    const hasOptions = options && options.length > 0

    return (
        <div role="combobox" className={styles.dropdown}>
            <select
                name={name}
                id={id}
                multiple={multiple}
                defaultValue={multiple ? undefined : ''}
                aria-label={placeholder}
            >
                {!multiple && <option value="" disabled>{placeholder}</option>}
                {hasOptions ? (
                    options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>
                        No options
                    </option>
                )}
            </select>
            <FiChevronDown size={16} className={styles.searchicon} />
        </div>
    )
}