"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  hospitals,
  PROVINCES,
  PROVINCE_ORDER,
  SPECIALTIES,
  districtsOf,
  provinceCounts,
  type Hospital,
  type HospitalSpecialty,
  type ProvinceKey,
} from "@/content/hospitals";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "./icons";

type GeoState = { status: "idle" | "loading" | "ready" | "denied"; lat?: number; lng?: number };

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const ne = (n: number | string) => String(n).replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]);

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function mapsUrl(h: Hospital) {
  if (h.lat && h.lng) return `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name} ${h.address} ${h.district}`)}`;
}

/** Normalise for matching: strip spaces/punctuation, fold a few Devanagari spelling variants. */
function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[\s.,()\-–]/g, "")
    .replace(/ण्ड/g, "ंड")
    .replace(/हस्पिटल|अस्पताल|हस्पीटल/g, "अस्पताल");
}

export function HospitalDirectory({ locale, compact = false }: { locale: string; compact?: boolean }) {
  const isEn = locale === "en";
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [province, setProvince] = useState<ProvinceKey | "">((params.get("province") as ProvinceKey) || "");
  const [district, setDistrict] = useState("");
  const [specialty, setSpecialty] = useState<HospitalSpecialty | "">("");
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const [limit, setLimit] = useState(compact ? 12 : 40);
  const deferredQ = useDeferredValue(q);

  const counts = useMemo(() => provinceCounts(), []);
  const districts = useMemo(() => districtsOf(province || undefined), [province]);

  // Search params are empty during static prerender, so the initial state above
  // only helps on dynamic renders — re-sync from the real URL after hydration.
  useEffect(() => {
    const p = params.get("province") as ProvinceKey | null;
    const qq = params.get("q");
    if (p && PROVINCE_ORDER.includes(p)) setProvince(p);
    if (qq) setQ(qq);
  }, [params]);

  useEffect(() => setDistrict(""), [province]);
  useEffect(() => setLimit(compact ? 12 : 40), [deferredQ, province, district, specialty, compact]);

  const results = useMemo(() => {
    const nq = norm(deferredQ);
    let list = hospitals.filter(
      (h) =>
        (!province || h.province === province) &&
        (!district || h.district === district) &&
        (!specialty || h.specialty === specialty) &&
        (!nq || norm(`${h.name} ${h.district} ${h.address} ${PROVINCES[h.province].ne} ${PROVINCES[h.province].en}`).includes(nq)),
    );
    if (geo.status === "ready" && geo.lat && geo.lng) {
      const me = { lat: geo.lat, lng: geo.lng };
      list = list
        .map((h) => ({ h, d: h.lat && h.lng ? distanceKm(me, { lat: h.lat, lng: h.lng }) : Infinity }))
        .sort((a, b) => a.d - b.d)
        .map((x) => x.h);
    }
    return list;
  }, [deferredQ, province, district, specialty, geo]);

  const locate = () => {
    trackEvent("hospital_locate");
    if (!("geolocation" in navigator)) return setGeo({ status: "denied" });
    setGeo({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ status: "ready", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeo({ status: "denied" }),
      { timeout: 8000, maximumAge: 300000 },
    );
  };

  const reset = () => {
    setQ("");
    setProvince("");
    setDistrict("");
    setSpecialty("");
    setGeo({ status: "idle" });
  };
  const filtered = Boolean(q || province || district || specialty || geo.status === "ready");

  return (
    <div>
      {/* Controls */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">{isEn ? "Search hospitals" : "अस्पताल खोज्नुहोस्"}</span>
            <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isEn ? "Hospital, district or place — e.g. Pokhara, Bir, आँखा" : "अस्पताल, जिल्ला वा ठाउँ — जस्तै पोखरा, बीर, आँखा"}
              className="input pl-10"
              autoComplete="off"
            />
          </label>
          <button
            type="button"
            onClick={locate}
            disabled={geo.status === "loading"}
            className={`btn-outline shrink-0 ${geo.status === "ready" ? "border-health-500 text-health-700" : ""}`}
          >
            <Icon name="locate" size={18} />
            {geo.status === "loading"
              ? isEn ? "Locating…" : "खोज्दै…"
              : geo.status === "ready"
                ? isEn ? "Sorted by distance" : "दूरी अनुसार"
                : isEn ? "Nearest to me" : "मेरो नजिकका"}
          </button>
        </div>
        {geo.status === "denied" && (
          <p className="mt-2 text-xs text-amber-700">
            {isEn
              ? "Location unavailable — allow location access in your browser, or pick a province below."
              : "Location उपलब्ध भएन — browser मा location अनुमति दिनुहोस् वा तल प्रदेश रोज्नुहोस्।"}
          </p>
        )}

        {/* Province chips */}
        <div className="scrollbar-thin -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          <button type="button" onClick={() => setProvince("")} className={`chip shrink-0 ${!province ? "chip-active" : ""}`}>
            {isEn ? "All provinces" : "सबै प्रदेश"}
            <span className="opacity-70">{isEn ? hospitals.length : ne(hospitals.length)}</span>
          </button>
          {PROVINCE_ORDER.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvince(p)}
              className={`chip shrink-0 ${province === p ? "chip-active" : ""}`}
            >
              {isEn ? PROVINCES[p].en : PROVINCES[p].short}
              <span className="opacity-70">{isEn ? counts[p] : ne(counts[p])}</span>
            </button>
          ))}
        </div>

        {!compact && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-ink-700">{isEn ? "District" : "जिल्ला"}</span>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="select">
                <option value="">{isEn ? "All districts" : "सबै जिल्ला"}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-ink-700">{isEn ? "Type" : "प्रकार"}</span>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value as HospitalSpecialty | "")} className="select">
                <option value="">{isEn ? "All types" : "सबै प्रकार"}</option>
                {(Object.keys(SPECIALTIES) as HospitalSpecialty[]).map((s) => (
                  <option key={s} value={s}>{isEn ? SPECIALTIES[s].en : SPECIALTIES[s].ne}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Result meta */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-500">
        <p aria-live="polite">
          {isEn ? (
            <>
              <strong className="text-ink-900">{results.length}</strong> of {hospitals.length} hospitals
            </>
          ) : (
            <>
              <strong className="text-ink-900">{ne(results.length)}</strong> / {ne(hospitals.length)} अस्पताल
            </>
          )}
          {province && <> · {isEn ? PROVINCES[province].en : PROVINCES[province].ne}</>}
          {district && <> · {district}</>}
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="btn-ghost btn-sm">
            <Icon name="x" size={14} />
            {isEn ? "Clear filters" : "फिल्टर हटाउनुहोस्"}
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="surface mt-4 p-8 text-center">
          <Icon name="hospital" size={28} className="mx-auto text-ink-300" />
          <p className="mt-3 font-semibold text-ink-800">
            {isEn ? "No hospital matches that search." : "यो खोजसँग मिल्ने अस्पताल भेटिएन।"}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {isEn
              ? "Try a district name or pick a province — Karnali currently has only one affiliated hospital."
              : "जिल्लाको नाम लेख्नुहोस् वा प्रदेश रोज्नुहोस् — कर्णालीमा हाल एउटा मात्र आबद्ध अस्पताल छ।"}
          </p>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {results.slice(0, limit).map((h) => {
            const d =
              geo.status === "ready" && geo.lat && geo.lng && h.lat && h.lng
                ? distanceKm({ lat: geo.lat, lng: geo.lng }, { lat: h.lat, lng: h.lng })
                : null;
            return (
              <li key={h.id} className="card flex flex-col p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <span className="icon-tile bg-health-50 text-health-700">
                    <Icon name={h.specialty === "eye" ? "eye" : h.specialty === "heart" ? "heart" : h.specialty === "children" ? "baby" : "hospital"} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-ink-900">
                      <Link href={`/hospitals/${h.id}`} className="hover:text-primary-700 hover:underline">
                        {h.name}
                      </Link>
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      {h.address && <>{h.address} · </>}
                      {h.district}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="badge-neutral">{isEn ? PROVINCES[h.province].en : PROVINCES[h.province].short}</span>
                      {h.specialty !== "general" && (
                        <span className="badge-health">{isEn ? SPECIALTIES[h.specialty].en : SPECIALTIES[h.specialty].ne}</span>
                      )}
                      {d !== null && Number.isFinite(d) && (
                        <span className="badge-primary">
                          <Icon name="locate" size={12} />
                          {isEn ? `${d.toFixed(d < 10 ? 1 : 0)} km` : `${ne(d.toFixed(d < 10 ? 1 : 0))} कि.मी.`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
                  <a
                    href={mapsUrl(h)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("cta_click", { cta: "maps", location: "hospital_directory" })}
                    className="btn-outline btn-sm flex-1"
                  >
                    <Icon name="mapPin" size={14} />
                    {isEn ? "Open in Maps" : "नक्सामा हेर्नुहोस्"}
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${h.name} ${h.district} phone`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost btn-sm"
                  >
                    <Icon name="phone" size={14} />
                    {isEn ? "Contact" : "सम्पर्क"}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {results.length > limit && (
        <div className="mt-5 text-center">
          <button type="button" onClick={() => setLimit((l) => l + 40)} className="btn-outline">
            {isEn
              ? `Show more (${results.length - limit} left)`
              : `थप हेर्नुहोस् (${ne(results.length - limit)} बाँकी)`}
          </button>
        </div>
      )}
    </div>
  );
}
