from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import geopandas as gpd
from shapely.geometry import mapping
import osmnx as ox
from osmnx._errors import InsufficientResponseError

# -----------------------
# OSMnx settings
# -----------------------
ox.settings.timeout = 180
ox.settings.use_cache = True
ox.settings.log_console = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hospitals")
def hospitals(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(5.0)
):
    """
    ALWAYS returns:
    {
        "type": "FeatureCollection",
        "features": [ ... ]
    }
    Even if no hospitals are found.
    Never raises HTTP 500.
    """

    try:
        # OSM tags to search
        tags = {"amenity": "hospital"}

        # Request from Overpass
        try:
            gdf = ox.features_from_point(
                (lat, lng),
                tags,
                dist=radius_km * 1000
            )
        except InsufficientResponseError:
            # No data from Overpass → return empty
            return {"type": "FeatureCollection", "features": []}

        # Fix CRS and convert to WGS84
        gdf = gdf.to_crs(epsg=4326)

        # Create user location point + circular buffer
        user = gpd.GeoDataFrame(
            geometry=gpd.points_from_xy([lng], [lat]),
            crs="EPSG:4326"
        )

        buffer = user.to_crs(3857).buffer(radius_km * 1000).to_crs(4326)

        # Spatial join → filter hospitals inside radius
        inside = gpd.sjoin(
            gdf,
            gpd.GeoDataFrame(geometry=buffer, crs="EPSG:4326"),
            how="inner",
            predicate="intersects"
        )

        # Convert to GeoJSON features
        features = []
        for _, row in inside.iterrows():
            geom = row.geometry
            props = {}

            # Safe name extraction
            name = row.get("name")
            if isinstance(name, str):
                props["name"] = name
            else:
                props["name"] = "Unnamed Hospital"

            features.append({
                "type": "Feature",
                "geometry": mapping(geom),
                "properties": props
            })

        return {
            "type": "FeatureCollection",
            "features": features
        }

    except Exception as e:
        # Catch-all fallback
        print("ERROR:", repr(e))
        return {
            "type": "FeatureCollection",
            "features": []
        }
