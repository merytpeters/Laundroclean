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

export default function ServiceAreaLocation({ onClose }: CloseProps) {
    const { data: serviceAreas = [], isLoading, error } = useServiceAreas();
    const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);

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
            <h4>Service Area Locations</h4>

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
                />

                <button
                    className={styles.mapCloseButton}
                    onClick={onClose}
                >
                    ✕ Close
                </button>
            </div>

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
