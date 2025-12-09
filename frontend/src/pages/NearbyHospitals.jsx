import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ----------------------
// Recenter helper
// ----------------------
function RecenterToArea({ lat, lng, radiusMeters }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radiusMeters)) return;

        // compute safe bounds without projections
        const R = 6378137; // meters
        const dLat = (radiusMeters / R) * (180 / Math.PI);
        const dLng = (radiusMeters / (R * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

        const southWest = L.latLng(lat - dLat, lng - dLng);
        const northEast = L.latLng(lat + dLat, lng + dLng);
        const bounds = L.latLngBounds(southWest, northEast);

        map.whenReady(() => {
            setTimeout(() => {
                try {
                    map.invalidateSize();
                    map.fitBounds(bounds, { padding: [30, 30], animate: true });
                } catch (e) {
                    console.error("Recenter error:", e);
                }
            }, 50);
        });
    }, [map, lat, lng, radiusMeters]);

    return null;
}

// ----------------------
// Small helpers
// ----------------------
const toNum = (s) => (Number.isFinite(Number(s)) ? Number(s) : null);
const validLat = (n) => n !== null && n >= -90 && n <= 90;
const validLng = (n) => n !== null && n >= -180 && n <= 180;
const validRadius = (n) => n !== null && n > 0 && n <= 50; // km

// distance in meters (haversine)
function distMeters(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const dLat = ((bLat - aLat) * Math.PI) / 180;
    const dLng = ((bLng - aLng) * Math.PI) / 180;
    const la1 = (aLat * Math.PI) / 180;
    const la2 = (bLat * Math.PI) / 180;
    const x =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(la1) * Math.cos(la2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
}

export default function NearbyHospitals({
    defaultLat = 16.543889,
    defaultLng = 81.521193,
    defaultRadiusKm = 5
}) {
    // form fields (strings)
    const [latStr, setLatStr] = useState(String(defaultLat));
    const [lngStr, setLngStr] = useState(String(defaultLng));
    const [radiusStr, setRadiusStr] = useState(String(defaultRadiusKm));

    // committed values used by the map and fetch
    const [lat, setLat] = useState(defaultLat);
    const [lng, setLng] = useState(defaultLng);
    const [radiusKm, setRadiusKm] = useState(defaultRadiusKm);

    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // improved geolocation state
    const [watchId, setWatchId] = useState(null);
    const [accuracy, setAccuracy] = useState(null); // meters
    const lastFetchedPosRef = useRef(null); // {lat, lng}

    async function fetchHospitals(_lat = lat, _lng = lng, _radiusKm = radiusKm) {
        try {
            setLoading(true);
            setErr("");
            const qs = new URLSearchParams({
                lat: String(_lat),
                lng: String(_lng),
                radius_km: String(_radiusKm)
            });
            const res = await fetch(`/api/gis/hospitals?${qs.toString()}`);
            const ct = res.headers.get("content-type") || "";
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (!ct.includes("application/json")) {
                const text = await res.text();
                throw new Error(`Expected JSON, got ${ct}. ${text.slice(0, 120)}`);
            }
            const data = await res.json();
            setFeatures(Array.isArray(data?.features) ? data.features : []);

            // record where we fetched for smart throttling
            lastFetchedPosRef.current = { lat: _lat, lng: _lng };
        } catch (e) {
            setErr(e.message || "Failed to load hospitals");
            setFeatures([]);
        } finally {
            setLoading(false);
        }
    }

    // initial load
    useEffect(() => {
        fetchHospitals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const nLat = toNum(latStr);
        const nLng = toNum(lngStr);
        const nRad = toNum(radiusStr);
        if (!validLat(nLat) || !validLng(nLng) || !validRadius(nRad)) {
            setErr("Please enter: lat (−90..90), lng (−180..180), radius (0–50 km).");
            return;
        }
        setLat(nLat);
        setLng(nLng);
        setRadiusKm(nRad);
        fetchHospitals(nLat, nLng, nRad);
    };

    // ----------------------
    // Improved HTML5 Geolocation
    // ----------------------
    const startWatching = () => {
        if (!navigator.geolocation) {
            setErr("Geolocation is not supported by your browser.");
            return;
        }
        setErr("Locating…");
        const id = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude, accuracy: acc } = pos.coords;
                setErr("");
                setAccuracy(acc ?? null);

                // update form + committed state
                setLatStr(String(latitude));
                setLngStr(String(longitude));
                setLat(latitude);
                setLng(longitude);

                // smart fetch:
                //  - if accuracy <= 100 m -> fetch
                //  - else if moved > 300 m from last fetched point -> fetch
                const last = lastFetchedPosRef.current;
                const movedFar =
                    last ? distMeters(last.lat, last.lng, latitude, longitude) > 300 : true;
                const goodAccuracy = typeof acc === "number" && acc <= 100;

                if (goodAccuracy || movedFar) {
                    fetchHospitals(latitude, longitude, radiusKm);
                }
            },
            (error) => {
                console.error("LOCATION WATCH ERROR:", error);
                if (error.code === 1) setErr("Permission denied. Enable location access.");
                else if (error.code === 2) setErr("Location unavailable.");
                else if (error.code === 3) setErr("Location request timed out.");
                else setErr("Unable to get location.");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
        setWatchId(id);
    };

    const stopWatching = () => {
        try {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        } catch { }
        setWatchId(null);
        setErr("");
    };

    // cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            } catch { }
        };
    }, [watchId]);

    // UI
    const watching = watchId !== null;
    const center = useMemo(() => [lat, lng], [lat, lng]);

    return (
        <div
            className="pt-24"
            style={{ height: "calc(100vh - 96px)", display: "grid", gridTemplateRows: "auto 1fr", gap: 8 }}
        >
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 px-3">
                <input
                    type="text"
                    inputMode="decimal"
                    value={latStr}
                    onChange={(e) => setLatStr(e.target.value)}
                    placeholder="Latitude"
                    className="border rounded px-2 py-1 w-36"
                />
                <input
                    type="text"
                    inputMode="decimal"
                    value={lngStr}
                    onChange={(e) => setLngStr(e.target.value)}
                    placeholder="Longitude"
                    className="border rounded px-2 py-1 w-36"
                />

                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white" disabled={loading}>
                    {loading ? "Loading..." : "Search"}
                </button>

                {/* Improved HTML5 Geolocation toggle */}
                {!watching ? (
                    <button
                        type="button"
                        onClick={startWatching}
                        className="px-3 py-1 rounded bg-green-600 text-white"
                        title="Continuously use device location"
                    >
                        Use My Location (Live)
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={stopWatching}
                        className="px-3 py-1 rounded bg-gray-700 text-white"
                        title="Stop using device location"
                    >
                        Stop
                    </button>
                )}

                <input
                    type="text"
                    inputMode="decimal"
                    value={radiusStr}
                    onChange={(e) => setRadiusStr(e.target.value)}
                    placeholder="Radius (km)"
                    className="border rounded px-2 py-1 w-32"
                />

                <span className="opacity-60 ml-2">
                    Results: {features.length}
                    {typeof accuracy === "number" && (
                        <span className="ml-3">Accuracy: ±{Math.round(accuracy)} m</span>
                    )}
                </span>
                {err && <span className="text-red-600 ml-3">{err}</span>}
            </form>

            {/* Map */}
            <div style={{ height: "100%", width: "100%" }}>
                <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                    />

                    {/* Auto fit to the selected area */}
                    <RecenterToArea lat={lat} lng={lng} radiusMeters={radiusKm * 1000} />

                    {/* Current center marker */}
                    <Marker position={[lat, lng]}>
                        <Popup>Your location</Popup>
                    </Marker>

                    {/* Search radius circle */}
                    <Circle center={[lat, lng]} radius={radiusKm * 1000} />

                    {/* Accuracy circle (faint) */}
                    {typeof accuracy === "number" && accuracy > 0 && (
                        <Circle
                            center={[lat, lng]}
                            radius={accuracy}
                            pathOptions={{ opacity: 0.25, fillOpacity: 0.08 }}
                        />
                    )}

                    {/* Hospital markers */}
                    {features.map((f, i) => {
                        const g = f.geometry;
                        if (!g) return null;

                        let coord = null;
                        if (g.type === "Point") coord = [g.coordinates[1], g.coordinates[0]];
                        else if (g.type === "Polygon" && g.coordinates?.[0]?.[0]) {
                            const [x, y] = g.coordinates[0][0];
                            coord = [y, x];
                        } else if (g.type === "LineString" && g.coordinates?.[0]) {
                            const [x, y] = g.coordinates[0];
                            coord = [y, x];
                        }

                        return coord ? (
                            <Marker key={i} position={coord}>
                                <Popup>{f.properties?.name || "Unnamed"}</Popup>
                            </Marker>
                        ) : null;
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
