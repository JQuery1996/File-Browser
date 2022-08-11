import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  Popup,
  SVGOverlay ,
  useMap,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import "./DMap.css";

const DMap = ({ rows, rowsCount, handleItemClickBtn }) => {
  const [position, setPosition] = useState(null);
  const [marker, setMarker] = useState([]);
  const [center, setCenter] = useState([]);
  useEffect(() => {
    if (rows) {
      setMarker(rows);
      setCenter([rows[0].POSITION_X,rows[0].POSITION_Y])
    }
  }, []);
  const handleItemClick = (row) => {
    handleItemClickBtn(null, row, "expand");
  };
  return (
    <>
    <div>عدد الزيارات : {rowsCount}</div>
      <MapContainer
        style={{ width: "100%", height: "55vh", margin: "aotu" }}
        center={[33.52182569717732, 36.295714581640716]}
        zoom={15}
        minZoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {rows.map((row) =>
          row.POSITION_X && row.POSITION_Y ? (
            <Marker position={[row.POSITION_X, row.POSITION_Y]}>
              <Popup>
                <div onClick={() => handleItemClick(row)}>
                  {row.NAME} {row.FNAME}
                </div>
              </Popup>
              <Tooltip>{row.DWD_ORGANIZTION_NAME}</Tooltip>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </>
  );
};
export default DMap;
