import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import { Cpu, Users, Wheat, Award, Activity, Sparkles, TrendingUp, Droplets } from "lucide-react";
import { villageDemographics, aiAgriTelemetry, dbtDisbursementData } from "../data/analyticsData";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

export default function AnalyticsHub({ lang }) {
  const isTe = lang === "te";

  // Chart 1: Land Cultivation Doughnut Chart
  const landChartData = {
    labels: isTe ? aiAgriTelemetry.landUseData.labelsTe : aiAgriTelemetry.landUseData.labelsEn,
    datasets: [
      {
        data: aiAgriTelemetry.landUseData.acres,
        backgroundColor: aiAgriTelemetry.landUseData.colors,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.4)",
      },
    ],
  };

  // Chart 2: Age Distribution Bar Chart
  const ageChartData = {
    labels: isTe ? villageDemographics.ageDistribution.labelsTe : villageDemographics.ageDistribution.labelsEn,
    datasets: [
      {
        label: isTe ? "జనాభా సంఖ్య" : "Population Count",
        data: villageDemographics.ageDistribution.data,
        backgroundColor: villageDemographics.ageDistribution.colors,
        borderRadius: 8,
      },
    ],
  };

  // Chart 3: DBT Welfare Disbursement Chart (In Lakhs ₹)
  const dbtChartData = {
    labels: isTe ? dbtDisbursementData.schemesBreakdown.labelsTe : dbtDisbursementData.schemesBreakdown.labelsEn,
    datasets: [
      {
        label: isTe ? "మంజూరైన నిధులు (లక్షల ₹ లలో)" : "Disbursed Amount (₹ in Lakhs)",
        data: dbtDisbursementData.schemesBreakdown.amountLakhs,
        backgroundColor: dbtDisbursementData.schemesBreakdown.colors,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="analytics-hub-container">
      {/* Top AI & IoT Precision Telemetry Bar (Zenze Agri Style) */}
      <div className="card hero-card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="hero-badge">
              <Cpu size={16} />
              <span>{isTe ? "ఏఐ & ఐఓటీ ప్రత్యక్ష పరిచేల దత్తాంశం" : "AI & IoT Telemetry Command Center"}</span>
            </div>
            <h2 className="hero-heading" style={{ fontSize: "1.6rem" }}>
              {isTe ? "నడిపూడి గ్రామ సాంకేతిక & జనాభా విశ్లేషణ" : "Nadipudi Real-Time AI Analytics & Census Dashboard"}
            </h2>
          </div>
          <span className="live-pill">🔴 LIVE SATELLITE & DBT FEED</span>
        </div>

        {/* ZenZe Style Live Sensor Telemetry Widgets */}
        <div className="grid-4" style={{ marginTop: "20px" }}>
          <div className="stat-card card" style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            <div className="stat-icon" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}>
              <Wheat size={22} />
            </div>
            <div>
              <div className="stat-number">{aiAgriTelemetry.soilMoisture}</div>
              <div className="stat-label">{isTe ? "మట్టి తేమ శాతం (Soil Moisture)" : "Optimal Soil Moisture"}</div>
            </div>
          </div>

          <div className="stat-card card" style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <div className="stat-icon" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}>
              <Droplets size={22} />
            </div>
            <div>
              <div className="stat-number">{aiAgriTelemetry.irrigationEfficiency}</div>
              <div className="stat-label">{isTe ? "సాగునీటి పంపిణీ సామర్థ్యం" : "Irrigation Canal Efficiency"}</div>
            </div>
          </div>

          <div className="stat-card card" style={{ background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.3)" }}>
            <div className="stat-icon" style={{ background: "rgba(251, 191, 36, 0.2)", color: "#fbbf24" }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div className="stat-number">{aiAgriTelemetry.npkScore}</div>
              <div className="stat-label">{isTe ? "నత్రజని-భాస్వరం మట్టి స్కోరు" : "N-P-K Soil Quality Score"}</div>
            </div>
          </div>

          <div className="stat-card card" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
            <div className="stat-icon" style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7" }}>
              <Award size={22} />
            </div>
            <div>
              <div className="stat-number">{dbtDisbursementData.totalAmountDisbursed}</div>
              <div className="stat-label">{isTe ? "మొత్తం పథకాల సొమ్ము జమ" : "Total Govt Benefits Disbursed"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Demographics & Land Cultivation Charts */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Chart 1: Land Cultivation Doughnut */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <Wheat size={22} />
            </div>
            <div>
              <h3>{isTe ? "భూమి వినియోగం & సాగు విస్తీర్ణం (ఎకరాలలో)" : "Land Use & Cultivation Breakdown (Acres)"}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isTe ? "మొత్తం నడిపూడి భూభాగ విస్తీర్ణం: 1,420 ఎకరాలు" : "Total Nadipudi Land Area: 1,420 Acres"}
              </p>
            </div>
          </div>
          <div style={{ height: "280px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Doughnut
              data={landChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Chart 2: Census Age Distribution */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <Users size={22} />
            </div>
            <div>
              <h3>{isTe ? "గ్రామ జనాభా & వయో సమూహాల విశ్లేషణ" : "Village Population Age Distribution"}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {isTe ? `మొత్తం జనాభా: ${villageDemographics.totalPopulation} | స్త్రీ/పురుష నిష్పత్తి: ${villageDemographics.sexRatio}` : `Total Population: ${villageDemographics.totalPopulation} | Sex Ratio: 982 F / 1000 M`}
              </p>
            </div>
          </div>
          <div style={{ height: "280px" }}>
            <Bar
              data={ageChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Direct Benefit Transfer (DBT) Scheme Disbursement */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.15)", color: "var(--accent-gold)" }}>
            <Award size={22} />
          </div>
          <div>
            <h3>{isTe ? "ఆంధ్రప్రదేశ్ ప్రభుత్వ సంక్షేమ నిధుల పంపిణీ (లక్షల ₹ లలో)" : "AP Govt Welfare DBT Disbursement (₹ in Lakhs)"}</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {isTe ? `మొత్తం లబ్ధిదారులు: ${dbtDisbursementData.totalBeneficiaryCount} మంది రైతులు & పౌరులు` : `Total Beneficiary Count: 1,870 Nadipudi Villagers`}
            </p>
          </div>
        </div>
        <div style={{ height: "300px" }}>
          <Bar
            data={dbtChartData}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
