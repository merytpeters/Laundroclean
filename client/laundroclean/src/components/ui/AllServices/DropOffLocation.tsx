"use client";

import { useState } from "react";
import {
    useDropoffPoints,
    isValidPoint,
    type DropoffPoint,
} from "src/hooks/locations/useDropoffPoints";

import LocationMap from "./LocationMap";
import styles from "./AllServices.module.css";

export type CloseProps = {
    onClose: () => void;
};

export default function DropOffLocation({ onClose }: CloseProps) {
    const { data: dropoffPoints = [], isLoading, error } = useDropoffPoints();

    const [selectedPoint, setSelectedPoint] =
        useState<DropoffPoint | null>(null);

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
            <h4>Drop-Off Locations</h4>

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
                    {dropoffPoints.map((point: DropoffPoint) => (
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
