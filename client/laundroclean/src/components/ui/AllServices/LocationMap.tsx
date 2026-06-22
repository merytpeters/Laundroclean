import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Rectangle,
    Polygon,
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
}

type LocationMapProps = {
    marker?: MarkerLocation;
    bounds?: BoundsArea;
    polygon?: PolygonArea;
    height?: string;
}

export default function LocationMap({
    marker,
    bounds,
    polygon,
    height = "400px",
}: LocationMapProps) {
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
      zoom={13}
      style={{
        height,
        width: "100%",
      }}
    >
      <TileLayer
        {...({ attribution: "&copy; OpenStreetMap contributors", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any)}
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