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
import type * as L from "leaflet";


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

  drawMode?: boolean;
  onAreaCreated?: (bounds: BoundsArea) => void;
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
  circle,
  drawMode,
  onAreaCreated,
}: LocationMapProps) {


  const [leaflet, setLeaflet] =
    useState<LeafletComponents | null>(null);


  const [drawComponents, setDrawComponents] =
    useState<{
      FeatureGroup: typeof import("react-leaflet")["FeatureGroup"];
      EditControl: typeof import("react-leaflet-draw")["EditControl"];
    } | null>(null);



  useEffect(() => {

    let mounted = true;


    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
      import("react-leaflet-draw"),
    ])
      .then(([L, leafletModules, drawModules]) => {

        if (!mounted) return;


        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });



        setLeaflet({

          MapContainer: leafletModules.MapContainer,

          TileLayer: leafletModules.TileLayer,

          Marker: leafletModules.Marker,

          Popup: leafletModules.Popup,

          Rectangle: leafletModules.Rectangle,

          Polygon: leafletModules.Polygon,

          Circle: leafletModules.Circle,

        });



        setDrawComponents({

          FeatureGroup: leafletModules.FeatureGroup,

          EditControl: drawModules.EditControl,

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



  const FeatureGroup =
    drawComponents?.FeatureGroup;


  const EditControl =
    drawComponents?.EditControl;



  return (

    <MapContainer

      center={[6.5244, 3.3792]}

      zoom={12}

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




      {drawMode &&
        FeatureGroup &&
        EditControl && (

          <FeatureGroup>

            <EditControl

              position="bottomright"


              draw={{
                rectangle: true,
                polygon: false,
                circle: false,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}


              onCreated={(event: L.DrawEvents.Created) => {


                const layer = event.layer as L.Rectangle
                const bounds = layer.getBounds();


                const southWest =
                  bounds.getSouthWest();


                const northEast =
                  bounds.getNorthEast();



                onAreaCreated?.({

                  minLat: southWest.lat,

                  maxLat: northEast.lat,

                  minLng: southWest.lng,

                  maxLng: northEast.lng,

                });


              }}

            />


          </FeatureGroup>

        )}





      {marker && (

        <Marker
          position={[
            marker.lat,
            marker.lng
          ]}
        >

          {marker.address && (

            <Popup>
              {marker.address}
            </Popup>

          )}

        </Marker>

      )}





      {bounds && (

        <Rectangle

          bounds={[

            [
              bounds.minLat,
              bounds.minLng
            ],

            [
              bounds.maxLat,
              bounds.maxLng
            ]

          ]}

        />

      )}





      {polygon && (

        <Polygon
          positions={polygon.coordinates}
        />

      )}





      {circle && (

        <Circle

          center={[
            circle.lat,
            circle.lng
          ]}

          radius={circle.radius}

        />

      )}



    </MapContainer>

  );

}