import React from "react";
import { Wheat, ExternalLink, CloudSun, Waves, TrendingUp, TrendingDown, Minus } from "lucide-react";
import SourceNote from "./SourceNote";
import { publicAgriLinks } from "../data/agriData";
import { useWeather, describeWeather, WEATHER_SOURCE } from "../utils/useWeather";
import {
  mandi,
  river,
  mandiDate,
  mandiIsStale,
  riverIsStale,
  riverStatus,
  riverStatusLabel,
  previousModal,
  formatDate,
  formatDayMonth,
  formatDateTime,
  rupees,
} from "../utils/liveData";

function PriceChange({ record, lang }) {
  const isTe = lang === "te";
  const previous = previousModal(record);
  if (!previous) return <span style={{ opacity: 0.7 }}>—</span>;
  const diff = record.modal - previous.modal;
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
  return (
    <span className="trend-badge" title={`${isTe ? "మునుపటి ధర" : "Previous"}: ${rupees(previous.modal)} (${formatDate(previous.date, lang)})`}>
      <Icon size={14} style={{ display: "inline", marginRight: "4px" }} />
      {diff === 0 ? (isTe ? "మార్పు లేదు" : "No change") : `${diff > 0 ? "+" : "−"}${rupees(Math.abs(diff))}`}
    </span>
  );
}

export default function AgriHub({ lang, t }) {
  const isTe = lang === "te";
  const weather = useWeather();
  const status = riverStatusLabel[riverStatus()];
  const { thresholds } = river;

  return (
    <div className="agri-hub-container">
      {/* Weather & river level */}
      <div className="grid-2">
        {/* Weather Card */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <CloudSun size={22} />
            </div>
            <div>
              <h3>{t.weatherTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {isTe ? "నడిపూడి, పెనుగొండ మండలం (534326)" : "Nadipudi, Penugonda Mandal (534326)"}
              </p>
            </div>
          </div>

          {weather.status === "loading" && <p style={{ margin: "16px 0" }}>{isTe ? "వాతావరణ సమాచారం లోడ్ అవుతోంది…" : "Loading weather…"}</p>}

          {weather.status === "error" && (
            <p style={{ margin: "16px 0" }}>
              {isTe
                ? "వాతావరణ సమాచారం ప్రస్తుతం అందుబాటులో లేదు. ఇంటర్నెట్ కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి."
                : "Weather is unavailable right now. Check your connection and try again."}
            </p>
          )}

          {weather.status === "ok" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "12px 0" }}>
                <div style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--primary-emerald)" }}>
                  {describeWeather(weather.data.code, lang).icon} {Math.round(weather.data.temperature)}°C
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{describeWeather(weather.data.code, lang).label}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {isTe ? "తేమ" : "Humidity"}: {weather.data.humidity}% · {isTe ? "గాలి" : "Wind"}: {Math.round(weather.data.wind)} km/h
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {weather.data.days.map((day, i) => (
                  <div key={day.date} style={{ background: "rgba(14, 94, 56, 0.06)", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", textAlign: "center" }}>
                    <div style={{ fontWeight: 600 }}>
                      {i === 0 ? (isTe ? "ఈ రోజు" : "Today") : formatDayMonth(day.date, lang)}
                    </div>
                    <div style={{ fontSize: "1.3rem" }}>{describeWeather(day.code, lang).icon}</div>
                    <div>
                      {Math.round(day.min)}–{Math.round(day.max)}°C
                    </div>
                    <div style={{ color: "var(--sky-blue)" }}>
                      🌧 {day.rainChance ?? 0}% · {day.rain} mm
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <SourceNote
            lang={lang}
            source={WEATHER_SOURCE.label}
            url={WEATHER_SOURCE.url}
            note={
              isTe
                ? "ఇది వాతావరణ నమూనా అంచనా; గ్రామంలో కొలిచిన విలువ కాదు"
                : "weather-model estimate for this area, not a measurement taken in the village"
            }
          />
          <p style={{ fontSize: "0.8rem", marginTop: "6px" }}>
            <a href="https://mausam.imd.gov.in/amaravati/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sky-blue)" }}>
              {isTe ? "అధికారిక హెచ్చరికలు & రైతు సలహాలు: IMD అమరావతి" : "Official warnings & farm advisories: IMD Amaravati"}{" "}
              <ExternalLink size={12} style={{ display: "inline" }} />
            </a>
          </p>
        </div>

        {/* Godavari level card */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <Waves size={22} />
            </div>
            <div>
              <h3>{t.canalTitle}</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {isTe ? "సర్ ఆర్థర్ కాటన్ బ్యారేజ్, ధవళేశ్వరం" : "Sir Arthur Cotton Barrage, Dowleswaram"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "12px 0", flexWrap: "wrap" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--sky-blue)" }}>{river.latest.level.toFixed(2)} m</div>
            <strong style={{ color: status.color }}>{isTe ? status.te : status.en}</strong>
          </div>

          {thresholds && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", fontSize: "0.85rem" }}>
              <div style={{ background: "rgba(251, 191, 36, 0.08)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>{isTe ? "హెచ్చరిక స్థాయి" : "Warning level"}</span>
                <strong>{thresholds.warning} m</strong>
              </div>
              <div style={{ background: "rgba(248, 113, 113, 0.08)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>{isTe ? "ప్రమాద స్థాయి" : "Danger level"}</span>
                <strong>{thresholds.danger} m</strong>
              </div>
              <div style={{ background: "rgba(2, 132, 199, 0.06)", padding: "10px", borderRadius: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.78rem" }}>
                  {isTe ? "అత్యధిక వరద" : "Highest flood"} ({thresholds.highestRecordedDate?.slice(0, 4)})
                </span>
                <strong>{thresholds.highestRecorded} m</strong>
              </div>
            </div>
          )}

          <p style={{ fontSize: "0.85rem", lineHeight: 1.5, marginTop: "12px" }}>
            {isTe
              ? "ఇది బ్యారేజ్ వద్ద నది నీటిమట్టం (మీటర్లలో). ఇన్‌ఫ్లో / అవుట్‌ఫ్లో (క్యూసెక్కులు) మరియు కాలువల నీటి విడుదల వివరాలు బహిరంగంగా అందుబాటులో లేవు — వాటి కోసం జలవనరుల శాఖ ప్రకటనలు చూడండి."
              : "This is the river level at the barrage, in metres. Inflow/outflow in cusecs and canal release schedules are not published as open data — see Water Resources Department announcements for those."}
          </p>

          <SourceNote
            lang={lang}
            source={isTe ? "కేంద్ర జల సంఘం (CWC) వరద అంచనా వ్యవస్థ" : "Central Water Commission flood forecast system"}
            url={river.sourceUrl}
            asOf={formatDateTime(river.latest.time, lang)}
            stale={riverIsStale}
          />
        </div>
      </div>

      {/* Mandi prices */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-title-group">
          <div className="card-icon-box">
            <Wheat size={22} />
          </div>
          <div>
            <h2>{t.mandiPricesTitle}</h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {t.mandiSubtitle} · {formatDate(mandiDate, lang)}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t.marketLocation}</th>
                <th>{t.cropName}</th>
                <th>{t.variety}</th>
                <th>{isTe ? "కనిష్ఠ – గరిష్ఠ" : "Min – Max"}</th>
                <th>{isTe ? "సాధారణ ధర (క్వింటాల్‌కు)" : "Modal price (per quintal)"}</th>
                <th>{isTe ? "మునుపటి రోజుతో మార్పు" : "Change from previous report"}</th>
              </tr>
            </thead>
            <tbody>
              {mandi.records.map((item) => (
                <tr key={`${item.market}-${item.commodity}-${item.variety}`}>
                  <td>
                    <strong>{item.market}</strong>
                  </td>
                  <td>{item.commodity}</td>
                  <td>{item.variety}</td>
                  <td>
                    {rupees(item.min)} – {rupees(item.max)}
                  </td>
                  <td>
                    <span className="price-badge">{rupees(item.modal)}</span>
                  </td>
                  <td>
                    <PriceChange record={item} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SourceNote
          lang={lang}
          source={isTe ? "Agmarknet రోజువారీ మార్కెట్ ధరలు (data.gov.in)" : "Agmarknet daily mandi prices (data.gov.in)"}
          url={mandi.sourceUrl}
          asOf={formatDate(mandiDate, lang)}
          stale={mandiIsStale}
          note={
            isTe
              ? "ప్రతి మార్కెట్ కమిటీ నివేదించిన ధరలు; ఆ రోజు నివేదించిన పశ్చిమ గోదావరి మార్కెట్లు మాత్రమే"
              : "prices as reported by each market committee; only West Godavari markets that reported that day"
          }
        />
        <p style={{ fontSize: "0.8rem", marginTop: "6px", color: "var(--text-muted)" }}>
          {isTe
            ? "రొయ్యలు, కొబ్బరి ధరలకు బహిరంగ అధికారిక మూలం లేదు, అందుకే ఇక్కడ చూపడం లేదు."
            : "Shrimp and coconut prices have no open official source, so they are not shown here."}
        </p>
      </div>

      {/* Public Agri Digital Links */}
      <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>
        🌐 {isTe ? "ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ వ్యవసాయ పోర్టల్స్" : "Public Government Agri Portals"}
      </h3>
      <div className="grid-2">
        {publicAgriLinks.map((link) => (
          <div key={link.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="badge-normal">{link.tag}</span>
              </div>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>
                {isTe ? link.titleTe : link.titleEn}
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                {isTe ? link.descTe : link.descEn}
              </p>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              <span>{t.officialLink}</span>
              <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
