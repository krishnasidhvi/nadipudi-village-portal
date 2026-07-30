import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { BarChart3, TrendingUp, Waves, Award, Vote } from "lucide-react";
import {
  commodityComparisonData,
  paddyTrendData,
  canalWaterFlowData,
  schemeBeneficiaryData,
  wardVoterData,
} from "../data/analyticsData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsHub({ lang, t }) {
  const isTe = lang === "te";

  // 1. Commodity Price Comparison Chart
  const priceComparisonChartData = {
    labels: isTe ? commodityComparisonData.labelsTe : commodityComparisonData.labelsEn,
    datasets: [
      {
        label: isTe ? "వరి ధర (₹/క్వింటాల్)" : "Paddy Price (₹/Qtl)",
        data: commodityComparisonData.paddyPrices,
        backgroundColor: "rgba(22, 163, 74, 0.75)",
        borderColor: "#16a34a",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  // 2. 7-Day Paddy Price Trend Line Chart
  const paddyTrendChartData = {
    labels: paddyTrendData.labels,
    datasets: [
      {
        label: isTe ? "స్వర్ణ వరి ధర (₹/క్వింటాల్)" : "Swarna Paddy Price (₹/Qtl)",
        data: paddyTrendData.prices,
        borderColor: "#d97706",
        backgroundColor: "rgba(217, 119, 6, 0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#d97706",
      },
    ],
  };

  // 3. Canal Water Discharge Trend Chart
  const canalWaterChartData = {
    labels: canalWaterFlowData.labels,
    datasets: [
      {
        label: isTe ? "ఇన్-ఫ్లో (క్యూసెక్కులు)" : "Barrage Inflow (Cusecs)",
        data: canalWaterFlowData.inflow,
        borderColor: "#0284c7",
        backgroundColor: "rgba(2, 132, 199, 0.1)",
        tension: 0.3,
      },
      {
        label: isTe ? "డెల్టా కాలువల విడుదల (క్యూసెక్కులు)" : "Canal Outflow (Cusecs)",
        data: canalWaterFlowData.outflow,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        tension: 0.3,
      },
    ],
  };

  // 4. Scheme Beneficiaries Coverage Bar Chart
  const schemeChartData = {
    labels: isTe ? schemeBeneficiaryData.labelsTe : schemeBeneficiaryData.labelsEn,
    datasets: [
      {
        label: isTe ? "లబ్ధి పొందిన కుటుంబాలు" : "Enrolled Beneficiaries",
        data: schemeBeneficiaryData.beneficiaries,
        backgroundColor: "rgba(14, 94, 56, 0.8)",
        borderRadius: 6,
      },
      {
        label: isTe ? "అర్హత కలిగిన మొత్తం కుటుంబాలు" : "Total Eligible Families",
        data: schemeBeneficiaryData.totalEligible,
        backgroundColor: "rgba(100, 116, 139, 0.3)",
        borderRadius: 6,
      },
    ],
  };

  // 5. Ward-Wise Voter Demographics Bar Chart
  const wardVoterChartData = {
    labels: isTe ? wardVoterData.labelsTe : wardVoterData.labelsEn,
    datasets: [
      {
        label: isTe ? "పురుష ఓటర్లు (Male)" : "Male Voters",
        data: wardVoterData.male,
        backgroundColor: "rgba(2, 132, 199, 0.75)",
        borderRadius: 4,
      },
      {
        label: isTe ? "మహిళా ఓటర్లు (Female)" : "Female Voters",
        data: wardVoterData.female,
        backgroundColor: "rgba(217, 119, 6, 0.75)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="analytics-hub-container">
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-title-group">
          <div className="card-icon-box">
            <BarChart3 size={22} />
          </div>
          <div>
            <h2>
              {isTe
                ? "నడిపూడి డిజిటల్ గ్రాఫికల్ విశ్లేషణలు & డేటా గ్రాఫ్‌లు"
                : "Nadipudi Village Graphical Analytics & Visual Charts"}
            </h2>
            <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>
              {isTe
                ? "పంట ధరల ట్రెండ్స్, కాలువల నీటి ఉధృతి, పథకాల సాయం & ఓటర్ల గ్రాఫ్‌ల ప్రదర్శన"
                : "Real-time visual representations for market trends, canal discharge, schemes, and voting demographics"}
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Agriculture & Mandi Charts */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Mandi Price Comparison */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--primary-emerald)" }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <h3>{isTe ? "సమీప మార్కెట్లలో వరి ధరల పోలిక (Mandi Comparison)" : "Mandi Paddy Price Comparison"}</h3>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <Bar data={priceComparisonChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* 7-Day Paddy Trend */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--accent-gold)" }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3>{isTe ? "స్వర్ణ వరి 7-రోజుల ధరల పెరుగుదల ట్రెండ్" : "7-Day Swarna Paddy Price Trend"}</h3>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <Line data={paddyTrendChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Row 2: Canal Water & Schemes Charts */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        {/* Canal Water Discharge Line Chart */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box" style={{ background: "rgba(2, 132, 199, 0.1)", color: "var(--sky-blue)" }}>
              <Waves size={20} />
            </div>
            <div>
              <h3>{isTe ? "గోదావరి బ్యారేజీ ఇన్-ఫ్లో & డెల్టా కాలువల ప్రవాహం" : "Godavari Barrage & Delta Canal Flow Trend"}</h3>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <Line data={canalWaterChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Scheme Beneficiaries Enrollment */}
        <div className="card">
          <div className="card-title-group">
            <div className="card-icon-box">
              <Award size={20} />
            </div>
            <div>
              <h3>{isTe ? "నడిపూడి లబ్ధిదారుల పథకాల కవరేజ్ (Scheme Enrolment)" : "Scheme Beneficiary Coverage Bar Chart"}</h3>
            </div>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <Bar data={schemeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Row 3: Election Ward Demographics Chart */}
      <div className="card">
        <div className="card-title-group">
          <div className="card-icon-box" style={{ background: "rgba(217, 119, 6, 0.1)", color: "var(--accent-gold)" }}>
            <Vote size={20} />
          </div>
          <div>
            <h3>{isTe ? "నడిపూడి వార్డుల వారీగా ఓటర్ల జనాభా & పురుష/మహిళా నిష్పత్తి" : "Ward-Wise Elector Demographics & Gender Breakdown"}</h3>
          </div>
        </div>
        <div style={{ height: "280px", width: "100%" }}>
          <Bar data={wardVoterChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
