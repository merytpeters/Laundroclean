"use client";

import { useDropoffPoints, type DropoffPoint } from "src/hooks/locations/useDropoffPoints";
import LocationMap from "./LocationMap";
import styles from "./AllServices.module.css";

export type CloseProps = {
    onClose: () => void;
};

export default function DropOffLocation({onClose}: CloseProps) {
    const { data: dropoffPoints = [], isLoading, error } = useDropoffPoints();

    if (isLoading) {
        return <div className={styles.loadingContainer}>Loading drop-off locations...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error loading drop-off locations: {error.message}</div>;
    }

    if (dropoffPoints.length === 0) {
        return <div className={styles.emptyContainer}>No drop-off locations found</div>;
    }

    const activeDropoff = dropoffPoints.find(point => point.isActive && point.lat && point.lng);

    return (
        <div className={styles.locationContainer}>
            <h3>Drop-Off Locations</h3>
            <div className={styles.mapWrapper}>
                {activeDropoff?.lat != null && activeDropoff?.lng != null ? (
                    <LocationMap
                        marker={{
                            lat: activeDropoff.lat,
                            lng: activeDropoff.lng,
                            address: activeDropoff.address,
                        }}
                        height="500px"
                    />
                ) : (
                    <div className={styles.noMapContainer}>No active drop-off location with coordinates</div>
                )}

                <button className={styles.mapCloseButton} onClick={onClose}>
                            ✕ Close
                        </button>
            </div>
            <div className={styles.dropoffPointsList}>
                <h4>Drop-Off Points ({dropoffPoints.length})</h4>
                <ul>
                    {dropoffPoints.map((point: DropoffPoint) => (
                        <li key={point.id}>
                            <strong>{point.name}</strong>
                            <div className={styles.pointDetails}>{point.address}</div>
                            {point.isActive ? (
                                <span className={styles.activeBadge}>Active</span>
                            ) : (
                                <span className={styles.inactiveBadge}>Inactive</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
