import React from "react";
import { Home, Landmark, Wheat, Award, Bell, BarChart3, Vote, PhoneCall, HelpCircle } from "lucide-react";

export default function Navigation({ activeTab, setActiveTab, t }) {
  const tabs = [
    { id: "home", label: t.tabHome, icon: Home },
    { id: "temple", label: t.tabTemple, icon: Landmark },
    { id: "agri", label: t.tabAgri, icon: Wheat },
    { id: "schemes", label: t.tabSchemes, icon: Award },
    { id: "notices", label: t.tabNotices, icon: Bell },
    { id: "analytics", label: t.tabAnalytics, icon: BarChart3 },
    { id: "elections", label: t.tabElection, icon: Vote },
    { id: "directory", label: t.tabDirectory, icon: PhoneCall },
    { id: "spandana", label: t.tabSpandana, icon: HelpCircle },
  ];

  return (
    <nav className="nav-tabs-wrapper">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <IconComponent size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
