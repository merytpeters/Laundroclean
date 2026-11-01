import { PromoCodeDto } from "src/types/laundrocleanServices/promoCode.dto";
import styles from './PromotionForm.module.css';
import { useForm } from "react-hook-form";
import { PromoCodeFormValues, PromoCodePayload, PromoTypeDropDownOptions } from "src/types/laundrocleanServices/promoCode";
import { ServiceDto } from "src/types/laundrocleanServices/laundrocleanservices.dto";
import Button from "../Button/Button";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { useCreatePromoCode } from "src/hooks/promoCodes/usePromoCode";
import { toUTCISOString } from "src/utils/globalTimezone";
import { toast } from "sonner";

interface PromoCodeProps {
    data?: PromoCodeDto[],
    services?: ServiceDto[],
    onClose: () => void;
}

export default function CreateNewPromo({ data, services, onClose }: PromoCodeProps) {
    const createPromoMutation = useCreatePromoCode();

    const formData = useForm<PromoCodeFormValues>({
        defaultValues: {
            code: "",
            description: "",
            serviceId: undefined,
            expiresAt: "",
            expiryTime: "00:00",
            type: undefined,
            value: undefined,
            currency: undefined,
            startsAt: "",
            startTime: "12:00",
            usageLimit: undefined,
            perUserLimit: undefined,
            isActive: true,
        }
    })

    const selectedServiceId = formData.watch("serviceId");

    const startsAt = formData.watch("startsAt")

    const selectedService = services?.find(
        (service) =>
            String(service.id) === selectedServiceId
    );

    if (selectedService) {
        const currency = selectedService?.prices?.[0]?.currency
        formData.setValue("currency", currency)
    }

    const filledCurrency = formData.watch("currency")

    const currencySymbol = filledCurrency
        ? mapCurrencySymbol(filledCurrency)
        : "";

    const handleCreatePromo = async (values: PromoCodeFormValues) => {
        console.log("FORM VALUES:", values);

        const {
            startTime,
            expiryTime,
            ...rest
        } = values;

        const payload: PromoCodePayload = {
            ...rest,
            startsAt: toUTCISOString(values.startsAt, startTime),
            expiresAt: toUTCISOString(values.expiresAt, expiryTime),
        };

        console.log("START DATE:", values.startsAt);
        console.log("START TIME:", startTime);
        console.log("CONVERTED START:", payload.startsAt);

        console.log("EXPIRY DATE:", values.expiresAt);
        console.log("EXPIRY TIME:", expiryTime);
        console.log("CONVERTED EXPIRY:", payload.expiresAt);

        console.log("FINAL PAYLOAD:", payload);

        createPromoMutation.mutate({ payload });
    };

    console.log("Currency:", formData.getValues("currency"))

    return (
        <form onSubmit={formData.handleSubmit(handleCreatePromo)} className={styles.promoform}>
            <h4>{data?.length === 0 ? "Add Your First Promocode" : "Add a New PromoCode"}</h4>
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
                            "serviceId", {
                                setValueAs: (value) => (value === "" ? undefined : value)
                            }
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

                {selectedService ? (
                    <span className={styles.formitem}>
                        <label htmlFor="currency">Currency</label>
                        <input type="text" id="currency" {...formData.register("currency")} placeholder={`${currencySymbol} ${selectedService?.prices?.[0]?.amount ?? ""}`} disabled />
                    </span>
                ) : (
                    <span className={styles.formitem}>
                        <label htmlFor="currency">Currency</label>
                        <select id="currency" {...formData.register("currency")}>
                            <option value="" disabled>Please choose currency</option>
                            <option value="NAIRA">₦</option>
                            <option value="DOLLAR">$</option>
                            <option value="POUNDS">£</option>
                        </select>
                    </span>
                )}


            </span>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="value">Value</label>
                    <input type="number" id="value" {...formData.register("value", { valueAsNumber: true, })} />
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
                    <label htmlFor="startTime">Start Time</label>
                    <input type="time" id="startTime" {...formData.register("startTime")} />
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="expiresAt">expiresAt</label>
                    <input type="date" id="expiresAt" min={startsAt || undefined}
                        {...formData.register("expiresAt", {
                            validate: (value) => {
                                const startsDate = formData.getValues("startsAt")
                                console.log("StartsAt:", startsAt)
                                console.log("StartsDate:", startsDate)

                                if (!startsDate) {
                                    toast.error('Set start date')
                                    return 'Set start date'
                                }

                                if (value <= startsDate) {
                                    toast.error('Expiry date cannot be before the start date')
                                    return ('Expiry date cannot be before the start date')
                                }
                            }
                        })} />
                    <label htmlFor="expiryTime">Expiry Time</label>
                    <input type="time" id="expiryTime" {...formData.register("expiryTime")} />
                </span>

            </span>
            <span className={styles.formgroup}>
                <span className={styles.formitem}>
                    <label htmlFor="usageLimit">Total Usage Limit</label>
                    <input type="number" id="usageLimit" {...formData.register("usageLimit", { valueAsNumber: true, })} />
                </span>

                <span className={styles.formitem}>
                    <label htmlFor="perUserLimit">Limit a single user gets</label>
                    <input type="number" id="perUserLimit" {...formData.register("perUserLimit", { valueAsNumber: true, })} />
                </span>
            </span>
            <span className={styles.actionbuttons}>
                <Button type="button" text="cancel" onClick={onClose} className={styles.cancelbutton} />
                <Button text="save" type="submit" className={styles.savebtn} />
            </span>

        </form>
    )
}