import React, { useState, useEffect } from "react";
import { StaticMap, MapContext, NavigationControl } from "react-map-gl";
import DeckGL from "deck.gl";
import { ColumnLayer } from '@deck.gl/layers';
import { tableFromIPC } from "apache-arrow";


async function getReadParquet() {
    // Reference: https://observablehq.com/@kylebarron/geoparquet-on-the-web
    const module = await import('https://unpkg.com/parquet-wasm@0.6.1/esm/parquet_wasm.js');
    await module.default();
    return module.readParquet;
}

const GEOARROW_POLYGON_DATA = "./DECENNIALDHC2020.parquet";

const INITIAL_VIEW_STATE = {
  latitude: 39.82,
  longitude: -98.57,
  zoom: 3,
  pitch: 50.5,
  bearing: 5
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
const NAV_CONTROL_STYLE = {
  position: "absolute",
  top: 10,
  left: 10,
  showCompass: true,
};

export function UsMap() {
  const onClick = (info) => {
    if (info.object) {
      console.log(info.object["BoroName"]);
    }
  };

  const [table, setTable] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const readParquet = await getReadParquet();
      const request = await fetch(GEOARROW_POLYGON_DATA);

      let parquetBytes = await request.arrayBuffer();
      if (!parquetBytes) {
        throw new Error('Failed to load parquet data from store.');
      }
      if (!ArrayBuffer.isView(parquetBytes)) {
        parquetBytes = new Uint8Array(parquetBytes);
      }
      const wasmTable = readParquet(parquetBytes);
      const arrowTable = tableFromIPC(wasmTable.intoIPCStream());

      window.table = arrowTable;
      setTable(arrowTable);
    };

    if (!table) {
      fetchData().catch(console.error);
    }
  });

  const layers = [];

  table && layers.push(
    new ColumnLayer({
        id: 'ColumnLayer',
        data: {
            src: table,
            length: table.numRows,
        },
        diskResolution: 12,
        extruded: true,
        radius: 1500,
        elevationScale: 5000,
        getElevation: (object, { index, data, target }) => {
            const row = data.src.get(index);
            return row["pop"] / 1000;
        },
        getFillColor: d => [120, 52, 125],
        getPosition: (object, { index, data, target }) => {
            const row = data.src.get(index);
            return [row["INTPTLON20"], row["INTPTLAT20"], 0];
        },
        opacity: 0.1,
        pickable: true
    })
  );
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      ContextProvider={MapContext.Provider}
      //onClick={onClick}
    >
      <StaticMap mapStyle={MAP_STYLE} />
      <NavigationControl style={NAV_CONTROL_STYLE} />
    </DeckGL>
  );
}

