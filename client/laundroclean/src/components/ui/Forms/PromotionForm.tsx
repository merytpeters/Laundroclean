import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";
import styles from './PromotionForm.module.css';
import { useForm } from "react-hook-form";
import { PromoCodePayload, PromoTypeDropDownOptions } from "src/types/laundrocleanServices/promoCode";
import { ServiceDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import Button from "../Button/Button";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";

interface PromoCodeProps {
    data?: PromoCodeDto[],
    services?: ServiceDto[],
    onClose: () => void;
}

export default function CreateNewPromo({ data, services, onClose }: PromoCodeProps) {

    const formData = useForm<PromoCodePayload>({
        defaultValues: {
            code: "",
            description: "",
            serviceId: "",
            expiresAt: "",
            type: undefined,
            value: 0,
            currency: undefined,
            startsAt: "",
            usageLimit: 0,
            perUserLimit: 0,
            isActive: true,
        }
    })

    const handleCreatePromo = async () => {

    }

    const selectedServiceId = formData.watch("serviceId");

    const selectedService = services?.find(
        (service) =>
            String(service.id) === selectedServiceId
    );

    const currency = selectedService?.prices?.[0]?.currency

    const selectedCurrency = formData.setValue("currency", currency)

    const startsAt = formData.getValues("startsAt")

    const currencySymbol = currency
        ? mapCurrencySymbol(currency)
        : "";

    return (
        <form onSubmit={formData.handleSubmit(handleCreatePromo)} className={styles.promoform}>
            <h4>{data?.length === 0 ? "Add Your First Promocode" : "Add a New Service"}</h4>
            <legend><b>Create a new promo code, let customers enjoy cool discounts</b> </legend>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="code">Code</label>
                    <input type="text" id="code" {...formData.register("code")} />
                </span>
                <span className={styles.formitem}>
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" {...formData.register("description")} />
                </span>

            </span>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="serviceId">
                        services
                    </label>

                    <select
                        id="serviceId"
                        {...formData.register(
                            "serviceId"
                        )}
                    >
                        <option value="">
                            select service
                        </option>

                        {services?.filter((service) => service.isActive)?.map(
                            (service) => (
                                <option
                                    key={service.id}
                                    value={service.id}
                                >
                                    {service.name}
                                </option>
                            )
                        )}
                    </select>
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="currency">Currency</label>
                    <input type="text" id="currency" {...formData.register("currency")} placeholder={`${currencySymbol} ${selectedService?.prices?.[0]?.amount ?? ""}`} disabled />
                </span>


            </span>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="value">Value</label>
                    <input type="number" id="value" {...formData.register("value")} />
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="type">Promo type</label>
                    <select
                        id="type"
                        {...formData.register(
                            "type"
                        )}
                    >

                        {PromoTypeDropDownOptions?.map(
                            (promotype) => (
                                <option
                                    key={promotype.value}
                                    value={promotype.value}
                                >
                                    {promotype.label}
                                </option>
                            )
                        )}
                    </select>
                </span>

            </span>

            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="startsAt">Starts at</label>
                    <input type="date" id="startsAt" {...formData.register("startsAt")} />
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="expiresAt">expiresAt</label>
                    <input type="date" id="expiresAt"
                        {...formData.register("expiresAt", {
                            validate: (value) => {
                                if (startsAt === undefined) {
                                    return 'Set start date'
                                }
                                return (
                                    value >= startsAt ||
                                    'It can not expire before the start date'
                                )
                            }
                        })} />
                </span>

            </span>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="usageLimit">Total Usage Limit</label>
                    <input type="number" id="usageLimit" {...formData.register("usageLimit")} />
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="perUserLimit">Limit a single user gets</label>
                    <input type="number" id="perUserLimit" {...formData.register("perUserLimit")} />
                </span>
            </span>
            <span className={styles.actionbuttons}>
                <Button type="button" text="cancel" onClick={onClose} className={styles.cancelbutton} />
                <Button text="save" type="submit" className={styles.savebtn} />
            </span>

        </form>
    )
}