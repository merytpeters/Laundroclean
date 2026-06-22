"use client";

import { useEffect, useState } from "react";

import type {
    MapContainer as MapContainerType,
    TileLayer as TileLayerType,
    Marker as MarkerType,
    Popup as PopupType,
    Rectangle as RectangleType,
    Polygon as PolygonType,
} from "react-leaflet";

type MarkerLocation = {
    lat: number;
    lng: number;
    address?: string;
};

type BoundsArea = {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};

type PolygonArea = {
    coordinates: [number, number][];
};

type LocationMapProps = {
    marker?: MarkerLocation;
    bounds?: BoundsArea;
    polygon?: PolygonArea;
    height?: string;
};

type LeafletComponents = {
    MapContainer: typeof MapContainerType;
    TileLayer: typeof TileLayerType;
    Marker: typeof MarkerType;
    Popup: typeof PopupType;
    Rectangle: typeof RectangleType;
    Polygon: typeof PolygonType;
};

export default function LocationMap({
    marker,
    bounds,
    polygon,
    height = "400px",
}: LocationMapProps) {
    const [leaflet, setLeaflet] = useState<LeafletComponents | null>(null);

    useEffect(() => {
        let isMounted = true;

        import("react-leaflet").then((modules) => {
            if (!isMounted) {
                return;
            }

            setLeaflet({
                MapContainer: modules.MapContainer,
                TileLayer: modules.TileLayer,
                Marker: modules.Marker,
                Popup: modules.Popup,
                Rectangle: modules.Rectangle,
                Polygon: modules.Polygon,
            });
        });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!leaflet) {
        return <div>Loading map...</div>;
    }

    const { MapContainer, TileLayer, Marker, Popup, Rectangle, Polygon } = leaflet;

    const mapBounds: [[number, number], [number, number]] = marker
        ? [
            [marker.lat, marker.lng],
            [marker.lat, marker.lng],
        ]
        : bounds
            ? [
                [bounds.minLat, bounds.minLng],
                [bounds.maxLat, bounds.maxLng],
            ]
            : polygon?.coordinates.length
                ? [polygon.coordinates[0], polygon.coordinates[0]]
                : [
                    [0, 0],
                    [0, 0],
                ];

    return (
        <MapContainer
            bounds={mapBounds}
            style={{
                height,
                width: "100%",
            }}
        >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {marker && (
                <Marker position={[marker.lat, marker.lng]}>
                    {marker.address && (
                        <Popup>{marker.address}</Popup>
                    )}
                </Marker>
            )}

            {bounds && (
                <Rectangle
                    bounds={[
                        [bounds.minLat, bounds.minLng],
                        [bounds.maxLat, bounds.maxLng],
                    ]}
                />
            )}

            {polygon && (
                <Polygon
                    positions={polygon.coordinates}
                />
            )}
        </MapContainer>
    );
}