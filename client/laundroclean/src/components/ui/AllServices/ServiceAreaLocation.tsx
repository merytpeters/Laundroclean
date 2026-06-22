"use client";

import { useServiceAreas, type ServiceArea } from "src/hooks/locations/useServiceAreas";
import LocationMap from "./LocationMap";
import styles from "./AllServices.module.css";

export default function ServiceAreaLocation() {
    const { data: serviceAreas = [], isLoading, error } = useServiceAreas();

    if (isLoading) {
        return <div className={styles.loadingContainer}>Loading service areas...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error loading service areas: {error.message}</div>;
    }

    if (serviceAreas.length === 0) {
        return <div className={styles.emptyContainer}>No service areas found</div>;
    }

    return (
        <div className={styles.locationContainer}>
            <h3>Service Area Locations</h3>
            <div className={styles.mapWrapper}>
                <LocationMap
                    bounds={
                        serviceAreas[0].latMin && serviceAreas[0].latMax && serviceAreas[0].lngMin && serviceAreas[0].lngMax
                            ? {
                                minLat: serviceAreas[0].latMin,
                                maxLat: serviceAreas[0].latMax,
                                minLng: serviceAreas[0].lngMin,
                                maxLng: serviceAreas[0].lngMax,
                            }
                            : undefined
                    }
                    height="500px"
                />
            </div>
            <div className={styles.serviceAreasList}>
                <h4>Service Areas ({serviceAreas.length})</h4>
                <ul>
                    {serviceAreas.map((area: ServiceArea) => (
                        <li key={area.id}>
                            <strong>{area.name}</strong>
                            {area.isActive ? (
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
