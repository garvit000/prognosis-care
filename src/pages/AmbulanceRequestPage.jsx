import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

const hospitalCoordinates = {
  'hosp-1': { lat: 28.6139, lng: 77.209 },
  'hosp-2': { lat: 28.5672, lng: 77.210 },
  'hosp-3': { lat: 28.5355, lng: 77.391 },
};

function hashAddressToPoint(address) {
  const text = (address || '').trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 10000;
  }

  return {
    lat: 28.45 + ((hash % 2200) / 2200) * 0.35,
    lng: 77.02 + ((Math.floor(hash / 97) % 2500) / 2500) * 0.45,
  };
}

function computeDistance(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function interpolate(start, end, progress) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

async function geocodeAddress(address) {
  const query = encodeURIComponent(address);
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1`);
  if (!response.ok) throw new Error('Unable to geocode address.');

  const list = await response.json();
  if (!Array.isArray(list) || !list.length) {
    throw new Error('Address not found on map.');
  }

  return {
    lat: Number(list[0].lat),
    lng: Number(list[0].lon),
  };
}

const ambulanceIcon = L.divIcon({
  html: '<div style="font-size: 22px;">🚑</div>',
  className: 'ambulance-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function FitToRoute({ hospitalPoint, patientPoint }) {
  const map = useMap();

  useEffect(() => {
    if (!hospitalPoint || !patientPoint) return;
    const bounds = L.latLngBounds(
      [hospitalPoint.lat, hospitalPoint.lng],
      [patientPoint.lat, patientPoint.lng]
    );
    map.fitBounds(bounds.pad(0.35));
  }, [map, hospitalPoint, patientPoint]);

  return null;
}

function AmbulanceRequestPage() {
  const { hospitals } = useApp();
  const [address, setAddress] = useState('');
  const [requested, setRequested] = useState(false);
  const [patientPoint, setPatientPoint] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [etaMins, setEtaMins] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  const nearestHospitalPoint = nearestHospital ? hospitalCoordinates[nearestHospital.id] : null;

  const ambulancePoint = useMemo(() => {
    if (!nearestHospitalPoint || !patientPoint) return null;
    return interpolate(nearestHospitalPoint, patientPoint, progress);
  }, [nearestHospitalPoint, patientPoint, progress]);

  useEffect(() => {
    if (!requested) return undefined;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 0.05, 1);
        const mins = Math.max(1, Math.ceil((1 - next) * (etaMins || 1)));

        if (next >= 1) {
          setStatusText('Ambulance has arrived at your location. Please stay reachable by phone.');
        } else if (next > 0.65) {
          setStatusText(`Ambulance is nearby. Estimated arrival in ~${mins} min.`);
        } else if (next > 0.3) {
          setStatusText(`Ambulance en route. Estimated arrival in ~${mins} min.`);
        } else {
          setStatusText(`Dispatch confirmed from ${nearestHospital?.name}. Estimated arrival in ~${mins} min.`);
        }

        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [requested, etaMins, nearestHospital?.name]);

  const handleRequestAmbulance = async () => {
    const normalizedAddress = address.trim();
    if (!normalizedAddress) return;

    setAddressError('');
    setIsResolvingAddress(true);

    let point;
    try {
      point = await geocodeAddress(normalizedAddress);
    } catch {
      point = hashAddressToPoint(normalizedAddress);
      setAddressError('Using approximate map location (simulation) because exact address lookup was unavailable.');
    } finally {
      setIsResolvingAddress(false);
    }

    const ranked = hospitals
      .map((hospital) => {
        const coord = hospitalCoordinates[hospital.id] || { lat: 28.61, lng: 77.21 };
        return {
          hospital,
          distance: computeDistance(coord, point),
        };
      })
      .sort((a, b) => a.distance - b.distance);

    const nearest = ranked[0];
    const simulatedEta = Math.max(4, Math.min(25, Math.round(nearest.distance / 1.2 + 3)));

    setPatientPoint(point);
    setNearestHospital(nearest.hospital);
    setEtaMins(simulatedEta);
    setProgress(0);
    setRequested(true);
    setStatusText(`Dispatch confirmed from ${nearest.hospital.name}. Estimated arrival in ~${simulatedEta} min.`);
  };

  const resetSimulation = () => {
    setRequested(false);
    setPatientPoint(null);
    setNearestHospital(null);
    setEtaMins(null);
    setProgress(0);
    setStatusText('');
  };

  return (
    <div className="page-shell space-y-4 pb-24">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Emergency Support</p>
        <h2 className="mt-1 text-2xl font-bold">Request Ambulance</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your address and we will dispatch the nearest hospital ambulance. This is a live simulation view.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Pickup Address
          <textarea
            className="input mt-2 min-h-[92px]"
            placeholder="Example: House 12, Sector 45, Near Metro Station, Gurugram"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
        {addressError ? <p className="mt-2 text-xs text-amber-700">{addressError}</p> : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleRequestAmbulance}
            disabled={!address.trim() || isResolvingAddress}
          >
            {isResolvingAddress ? 'Locating Address...' : 'Request Ambulance'}
          </button>
          {requested ? (
            <button type="button" className="btn-secondary" onClick={resetSimulation}>
              Reset Simulation
            </button>
          ) : null}
        </div>
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Live Ambulance Tracking</h3>
          {requested && nearestHospital ? (
            <p className="text-sm text-slate-600">Nearest Hospital: <span className="font-semibold text-med-700">{nearestHospital.name}</span></p>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <MapContainer center={[28.6139, 77.209]} zoom={11} className="h-[380px] rounded-xl border border-slate-200">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hospitals.map((hospital) => {
              const point = hospitalCoordinates[hospital.id] || { lat: 28.61, lng: 77.21 };
              return (
                <CircleMarker
                  key={hospital.id}
                  center={[point.lat, point.lng]}
                  radius={8}
                  pathOptions={{ color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.9 }}
                >
                  <Popup>🏥 {hospital.name}</Popup>
                </CircleMarker>
              );
            })}

            {patientPoint ? (
              <CircleMarker
                center={[patientPoint.lat, patientPoint.lng]}
                radius={8}
                pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.9 }}
              >
                <Popup>📍 Patient Pickup Location</Popup>
              </CircleMarker>
            ) : null}

            {nearestHospitalPoint && patientPoint ? (
              <Polyline
                positions={[
                  [nearestHospitalPoint.lat, nearestHospitalPoint.lng],
                  [patientPoint.lat, patientPoint.lng],
                ]}
                pathOptions={{ color: '#64748b', dashArray: '6 8' }}
              />
            ) : null}

            {ambulancePoint ? (
              <Marker position={[ambulancePoint.lat, ambulancePoint.lng]} icon={ambulanceIcon}>
                <Popup>🚑 Ambulance (Live Simulation)</Popup>
              </Marker>
            ) : null}

            <FitToRoute hospitalPoint={nearestHospitalPoint} patientPoint={patientPoint} />
          </MapContainer>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {requested ? (
            <>
              <p className="text-sm font-medium text-slate-700">{statusText}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Tracking progress: {Math.round(progress * 100)}%</p>
              <p className="mt-2 text-xs text-slate-500">
                Share this tracking page from your phone to monitor ambulance movement in real-time (simulation).
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-600">Enter your address and tap Request Ambulance to start live tracking.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AmbulanceRequestPage;