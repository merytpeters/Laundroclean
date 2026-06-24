"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import type {
  MapContainer as MapContainerType,
  TileLayer as TileLayerType,
  Marker as MarkerType,
  Popup as PopupType,
  Rectangle as RectangleType,
  Polygon as PolygonType,
  Circle as CircleType,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


type CircleArea = {
  lat: number;
  lng: number;
  radius: number;
};

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
  circle?: CircleArea;
};

type LeafletComponents = {
  MapContainer: typeof MapContainerType;
  TileLayer: typeof TileLayerType;
  Marker: typeof MarkerType;
  Popup: typeof PopupType;
  Rectangle: typeof RectangleType;
  Polygon: typeof PolygonType;
  Circle: typeof CircleType;
};


function MapFix() {
  const map = useMap();

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    });

    return () => cancelAnimationFrame(t);
  }, [map]);

  return null;
}

export default function LocationMap({
  marker,
  bounds,
  polygon,
  height = "200px",
  circle
}: LocationMapProps) {
  const [leaflet, setLeaflet] = useState<LeafletComponents | null>(null);

  useEffect(() => {
    let mounted = true;

    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });

    import("react-leaflet").then((modules) => {
      if (!mounted) return;

      setLeaflet({
        MapContainer: modules.MapContainer,
        TileLayer: modules.TileLayer,
        Marker: modules.Marker,
        Popup: modules.Popup,
        Rectangle: modules.Rectangle,
        Polygon: modules.Polygon,
        Circle: modules.Circle,
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!leaflet) {
    return <div>Loading map...</div>;
  }

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Rectangle,
    Polygon,
    Circle,
  } = leaflet;

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{
        height,
        width: "100%",
      }}
    >
      <MapFix />

      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
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
        <Polygon positions={polygon.coordinates} />
      )}

      {circle && (
        <Circle
          center={[circle.lat, circle.lng]}
          radius={circle.radius}
        />
      )}
    </MapContainer>
  );
}