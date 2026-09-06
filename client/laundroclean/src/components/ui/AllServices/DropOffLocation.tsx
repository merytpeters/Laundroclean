"use client";

import { useState } from "react";
import {
    useCreateDropOffPoint,
    useDropoffPoints,
} from "src/hooks/locations/useDropoffPoints";
import { isValidPoint } from "src/utils/locationUtils";
import type { DropoffPointDto, DropoffPointsDto } from "src/types/location/location.dto";

import LocationMap from "./LocationMap";
import styles from "./AllServices.module.css";
import Button from "../Button/Button";
import { Client, CompanyUser } from "src/types/users/user";
import { DropOffPointPayload, DropOffPointResponse } from "src/types/location/location";
import { FiEdit } from "react-icons/fi";

export type CloseProps = {
    onClose: () => void;
    usertype?: CompanyUser | Client;
};

type DropOffPoinstLengthProp = {
    dropOffPointsLength: number;
}

function DropOffPoints({dropOffPointsLength} : DropOffPoinstLengthProp) {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<DropOffPointPayload>({
        name: "",
        address: "",
    });

    const headerText = "Add Your First Drop off location";

    const createDropOffPointsMutation = useCreateDropOffPoint();

    const handleCreateDropOffPoint = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        createDropOffPointsMutation.mutate(
            {
                payload: formData,
            },
            {
                onSuccess: () => {
                    setFormData({
                        name: "",
                        address: "",
                    });

                    setIsFormOpen(false);
                },
            }
        );
    };

    return (
        <div className={styles.servicemanager}>
            {!isFormOpen && (
                <Button
                    text={
                        dropOffPointsLength === 0
                            ? "Create First Drop off point"
                            : "Create Drop off point"
                    }
                    onClick={() => setIsFormOpen(true)}
                    className={styles.addservicebtn}
                />
            )}

            {isFormOpen && (
                <div>
                    <span className={styles.overlay}></span>

                    <form onSubmit={handleCreateDropOffPoint}>
                        <p className={styles.newdropoffHeader}>
                            {dropOffPointsLength === 0
                                ? headerText
                                : "Add a New Drop off Location"}
                        </p>

                        <legend>
                            <b>
                                Create a new drop off point, an address where
                                clients can drop their laundry for collective
                                pick up
                            </b>
                        </legend>

                        <span className={styles.formgroup}>
                            <span className={styles.formitem}>
                                <label htmlFor="name">
                                    Drop off location name
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </span>

                            <span className={styles.formitem}>
                                <label htmlFor="address">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            address: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </span>
                        </span>

                        <span className={styles.actionbuttons}>
                            <Button
                                type="button"
                                text="cancel"
                                onClick={() => setIsFormOpen(false)}
                                className={styles.cancelbutton}
                            />

                            <Button
                                text="save"
                                type="submit"
                                className={styles.savebtn}
                            />
                        </span>
                    </form>
                </div>
            )}
        </div>
    );
}

export default function DropOffLocation({ onClose, usertype }: CloseProps) {
    const [selectedPoint, setSelectedPoint] =
        useState<DropOffPointResponse | null>(null);
    const { data: dropoffPointsData = [], isLoading, error } = useDropoffPoints({});

    const dropoffPoints = Array.isArray(dropoffPointsData)
        ? dropoffPointsData
        : Array.isArray(dropoffPointsData?.data)
            ? dropoffPointsData.data
            : [];
    
    if (dropoffPoints.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                No drop off points found
            </div>
        );
    }

    

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                Loading drop-off locations...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                Error loading drop-off locations: {error.message}
            </div>
        );
    }

    if (dropoffPoints.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                No drop-off locations found
            </div>
        );
    }

    const fallbackPoint =
        dropoffPoints.find(
            (p) => p.isActive && p.lat != null && p.lng != null
        ) ?? null;

    const activePoint = selectedPoint ?? fallbackPoint;

    const validPoint = isValidPoint(activePoint)
        ? activePoint
        : null;

    return (
        <div className={styles.locationContainer}>
            <span className={styles.dropoffPointsHeader}>

                <h4>Drop-Off Locations</h4>

                {usertype?.type === "COMPANYUSER" && (<DropOffPoints dropOffPointsLength={dropoffPoints.length}/> )}

            </span>


            <div className={styles.mapWrapper}>
                {validPoint ? (
                    <LocationMap
                        marker={{
                            lat: validPoint.lat,
                            lng: validPoint.lng,
                            address: validPoint.address,
                        }}
                        height="500px"
                    />
                ) : (
                    <div className={styles.noMapContainer}>
                        No valid drop-off location found
                    </div>
                )}

                <button
                    className={styles.mapCloseButton}
                    onClick={onClose}
                >
                    ✕ Close
                </button>
            </div>

            <div className={styles.dropoffPointsList}>
                <h4>Drop-Off Points ({dropoffPoints.length})</h4>

                <ul>
                    {dropoffPoints.map((point: DropoffPointDto) => (
                        <li
                            key={point.id}
                            onClick={() => setSelectedPoint(point)}
                            className={`${styles.listItem} ${selectedPoint?.id === point.id
                                ? styles.selectedItem
                                : ""
                                }`}
                            style={{ cursor: "pointer" }}
                        >
                            <strong>{point.name}</strong>

                            <div className={styles.pointDetails}>
                                {point.address}
                            </div>

                            <div>
                                <FiEdit />
                            </div>

                            {point.isActive ? (
                                <span className={styles.activeBadge}>
                                    Active
                                </span>
                            ) : (
                                <span className={styles.inactiveBadge}>
                                    Inactive
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
