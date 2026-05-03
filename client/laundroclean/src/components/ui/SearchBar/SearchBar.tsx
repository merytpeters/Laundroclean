import { FiSearch } from "react-icons/fi";
import styles from './SearchBar.module.css'

export default function SearchBar () {
    return (
        <div role="searchbox" className={styles.searchbox}>
            <input type="search" name="search-box" id="searchbox" placeholder="Search..." />
            <FiSearch size={16} className={styles.searchicon}/>
        </div>
    )
}