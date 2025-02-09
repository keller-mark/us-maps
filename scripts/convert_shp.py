import marimo

__generated_with = "0.11.0"
app = marimo.App(width="medium")


@app.cell
def _():
    from lonboard import Map, ScatterplotLayer, PolygonLayer
    from lonboard.colormap import apply_continuous_cmap
    import numpy as np
    from shapely.geometry import Point
    return (
        Map,
        Point,
        PolygonLayer,
        ScatterplotLayer,
        apply_continuous_cmap,
        np,
    )


@app.cell
def _(small_df):
    small_df["geometry"].dtype
    return


@app.cell
def _(np, small_df):
    heights = np.nan_to_num(small_df["P1_001N"].to_numpy(), nan=1)
    return (heights,)


@app.cell
def _(heights):
    norm_heights = heights / heights.max()
    return (norm_heights,)


@app.cell
def _(Map, PolygonLayer, heights, small_df):
    layer = PolygonLayer.from_geopandas(small_df[["geometry"]].head(),
        extruded=True,
        get_elevation=heights[:5],
        get_fill_color=[255, 0, 0],
    )
    m = Map(layer, _height=800)
    m
    return layer, m


@app.cell
def _():
    return


@app.cell
def _(small_df):
    small_df[["geometry"]].shape
    return


@app.cell
def _(heights):
    heights.shape
    return


@app.cell
def _():
    import geopandas as gpd
    import pandas as pd
    return gpd, pd


@app.cell
def _(pd):
    pop_df = pd.read_csv("../data/DECENNIALDHC2020.P1_2025-02-06T154203/DECENNIALDHC2020.P1-Data.csv", skiprows=[1])
    pop_df["zip"] = pop_df["NAME"].apply(lambda s: s[s.index(" ")+1:])
    return (pop_df,)


@app.cell
def _(gpd, pop_df):
    df = gpd.read_file("../data/tl_2020_us_zcta520/tl_2020_us_zcta520.shp").merge(pop_df, left_on="GEOID20", right_on="zip")
    return (df,)


@app.cell
def _():
    return


@app.cell
def _(df):
    small_df = df[["zip", "P1_001N", "INTPTLAT20", "INTPTLON20", "geometry"]].rename(columns={"P1_001N": "pop"})
    return (small_df,)


@app.cell
def _(small_df):
    small_df.to_parquet("../data/tl_2020_us_zcta520/tl_2020_us_zcta520.parquet", geometry_encoding="geoarrow")
    return


@app.cell
def _(Point, gpd, small_df):
    smaller_df = gpd.GeoDataFrame(small_df[["zip", "pop", "INTPTLAT20", "INTPTLON20"]])
    smaller_df["geometry"] = gpd.GeoSeries(smaller_df.apply(lambda row: Point(row["INTPTLAT20"], row["INTPTLON20"]), axis='columns').tolist())
    smaller_df[["zip", "pop", "geometry"]].to_parquet("../data/tl_2020_us_zcta520/small.parquet", geometry_encoding="geoarrow")
    return (smaller_df,)


@app.cell
def _(np, small_df):
    tiny_df = small_df[["zip", "pop", "INTPTLAT20", "INTPTLON20"]]
    tiny_df["pop"] = tiny_df["pop"].astype(np.int32)
    tiny_df["zip"] = tiny_df["zip"].astype(np.int32)
    tiny_df["INTPTLAT20"] = tiny_df["INTPTLAT20"].astype(np.float32)
    tiny_df["INTPTLON20"] = tiny_df["INTPTLON20"].astype(np.float32)
    tiny_df.to_parquet("../data/tl_2020_us_zcta520/smaller.parquet")
    return (tiny_df,)


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
