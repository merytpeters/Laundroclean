"use client";

import { useState } from "react";
import {
    useServiceAreas,
    isValidArea,
    getCenter,
    getRadius,
    type ServiceArea,
} from "src/hooks/locations/useServiceAreas";

import LocationMap from "./LocationMap";
import styles from "./AllServices.module.css";
import { CloseProps } from "./DropOffLocation";
import Button from "../Button/Button";

export default function ServiceAreaLocation({ onClose, usertype }: CloseProps) {
    const { data: serviceAreas = [], isLoading, error } = useServiceAreas();
    const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newArea, setNewArea] = useState({
        name: "",
        latMin: 0,
        latMax: 0,
        lngMin: 0,
        lngMax: 0,
    });

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                Loading service areas...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                Error loading service areas: {error.message}
            </div>
        );
    }

    if (serviceAreas.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                No service areas found
            </div>
        );
    }

    const fallbackArea =
        serviceAreas.find(isValidArea) ?? null;

    const activeArea = selectedArea ?? fallbackArea;

    const center = activeArea ? getCenter(activeArea) : null;
    const radius = activeArea ? getRadius(activeArea) : 0;

    return (
        <div className={styles.locationContainer}>
            <div className={styles.mapHeader}>
                <h4>Service Area Locations</h4>

                {usertype?.type === "COMPANYUSER" && (<Button
                    onClick={() => {
                        console.log("creating");
                        setIsCreating(true);
                        setSelectedArea(null);
                    }}
                    text="+ Create Service Area"
                    className={styles.createServicareabtn}
                />
                )}
            </div>


            <div className={styles.mapWrapper}>
                <LocationMap
                    circle={
                        center
                            ? {
                                lat: center.lat,
                                lng: center.lng,
                                radius,
                            }
                            : undefined
                    }
                    bounds={
                        activeArea && isValidArea(activeArea)
                            ? {
                                minLat: activeArea.latMin,
                                maxLat: activeArea.latMax,
                                minLng: activeArea.lngMin,
                                maxLng: activeArea.lngMax,
                            }
                            : undefined
                    }
                    height="500px"

                    drawMode={isCreating}


                    onAreaCreated={(bounds) => {

                        setNewArea({
                            name: "",
                            latMin: bounds.minLat,
                            latMax: bounds.maxLat,
                            lngMin: bounds.minLng,
                            lngMax: bounds.maxLng,
                        });

                    }}
                />



                <button
                    className={styles.mapCloseButton}
                    onClick={onClose}
                >
                    ✕ Close
                </button>
            </div>

            {newArea.latMin !== 0 && (

                <div className={styles.modal}>

                    <h3>
                        New Service Area
                    </h3>


                    <input
                        placeholder="Service area name"
                        value={newArea.name}
                        onChange={(e) =>
                            setNewArea({
                                ...newArea,
                                name: e.target.value
                            })
                        }
                    />


                    <p>
                        Lat Min: {newArea.latMin}
                    </p>

                    <p>
                        Lat Max: {newArea.latMax}
                    </p>

                    <p>
                        Lng Min: {newArea.lngMin}
                    </p>

                    <p>
                        Lng Max: {newArea.lngMax}
                    </p>



                    <button
                        onClick={() => {
                            console.log(newArea);

                            // call mutation here
                            // createServiceArea(newArea)

                            setNewArea({
                                name: "",
                                latMin: 0,
                                latMax: 0,
                                lngMin: 0,
                                lngMax: 0,
                            });

                            setIsCreating(false);
                        }}
                    >
                        Save Area
                    </button>


                </div>

            )}


            <div className={styles.serviceAreasList}>
                <h4>Service Areas ({serviceAreas.length})</h4>

                <ul>
                    {serviceAreas.map((area: ServiceArea) => (
                        <li
                            key={area.id}
                            onClick={() => setSelectedArea(area)}
                            className={`${styles.listItem} ${selectedArea?.id === area.id
                                ? styles.selectedItem
                                : ""
                                }`}
                            style={{ cursor: "pointer" }}
                        >
                            <strong>{area.name}</strong>

                            {area.isActive ? (
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
