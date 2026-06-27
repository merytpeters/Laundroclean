import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { promoDetails } from "src/services/promoService/mock";
import Button from "../Button/Button";
import styles from "./PromoCard.module.css";

export default function PromoCard() {
    return (
        <>
        {/** if type percenctage type = %, if fixed amount type = mappedCurrency */}
        {promoDetails.map((promoResponse) => {
            let currency = "";
            let usageleft = 0;
            if (promoResponse.currency) currency = promoResponse.currency ? mapCurrencySymbol(promoResponse.currency) : promoResponse.currency;
            if (promoResponse.perUserLimit !== undefined && promoResponse.timesUsed !== undefined) usageleft = promoResponse.perUserLimit - promoResponse.timesUsed
            return(
                <div className={styles.promocontainer} key={promoResponse.id}>
                    <h3>{promoResponse.type === "PERCENTAGE" ? `${promoResponse.value}%` : `${currency} ${promoResponse.value}`} Discount</h3>
                    <span className={styles.promodescription}>{promoResponse.description}</span>
                    <span className={styles.textnexpiry}>This promocode can be used {usageleft} more times, valid until {new Date(promoResponse.expiresAt).toLocaleDateString()}</span>
                    <Button text={promoResponse.code} className={styles.promocodebtn}></Button>
                </div>
            );
        })}
        </>
    )
}