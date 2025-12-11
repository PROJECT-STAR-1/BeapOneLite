"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/component/BeapOneLite/Layout";

import {
  Briefcase,
  Users,
  Search,
  ChevronDown,
  Plus,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  XCircle,
  FolderOpen,
  Info,
  Loader2,
} from "lucide-react";

// CONSTANTS
const PRIMARY_COLOR = "text-indigo-600";
const ACCENT_COLOR = "bg-indigo-600";
const ICON_SIZE_SM = 16;

// Helper function to format Naira currency
const formatNaira = (amount) => {
  return `₦ ${new Intl.NumberFormat("en-US").format(amount || 0)}`;
};

// --- SUB-COMPONENTS ---

/**
 * Renders a small badge for project status.
 */
const StatusBadge = ({ status }) => {
  let colorClass = "";
  if (status === "Active") {
    colorClass = "bg-green-100 text-green-800 border-green-300";
  } else if (status === "Completed") {
    colorClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
  } else {
    colorClass = "bg-gray-100 text-gray-800 border-gray-300";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};

/**
 * Renders the Profit Margin and Gross Profit metric card.
 */
const ProfitMetrics = ({ margin, profit, revenue }) => {
  const isProfitable = margin > 0;
  const marginColor = isProfitable
    ? "text-green-700 bg-green-50"
    : "text-red-700 bg-red-50";
  const MarginIcon = isProfitable ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col space-y-2 text-right">
      {/* Profit Margin */}
      <div
        className={`flex items-center justify-end text-sm font-bold p-1 rounded-lg ${marginColor}`}>
        <span className="mr-1">{margin?.toFixed(1)}%</span>
        <MarginIcon size={ICON_SIZE_SM} />
      </div>

      {/* Gross Profit */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900 leading-none">
          {formatNaira(profit)}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatNaira(revenue)} revenue
        </p>
      </div>
    </div>
  );
};

/**
 * Renders the BUR (Billable Utilization Rate) metric.
 */
const BURMetrics = ({ bur, burHours }) => {
  const burColor = bur >= 80 ? "text-green-600" : "text-yellow-600";

  return (
    <div className="text-right">
      <p className={`text-lg font-bold ${burColor} leading-none`}>{bur}%</p>
      <p className="text-xs text-gray-500 mt-0.5">{burHours}h billable</p>
    </div>
  );
};

/**
 * Renders a single Project item card.
 */
const ProjectItem = ({ project }) => {
  const isCompleted = project.status === "Completed";

  // Border color strip based on status logic
  const borderColor = isCompleted
    ? "border-l-4 border-indigo-500"
    : project.profitMargin === 0
    ? "border-l-4 border-red-500"
    : "border-l-4 border-green-500";

  return (
    <div
      className={`
            relative flex flex-col md:flex-row justify-between p-4 md:p-6 bg-white rounded-xl shadow-lg border border-gray-200
            ${borderColor}
        `}>
      {/* Project Info Block (Left) */}
      <div className="flex space-x-4 mb-4 md:mb-0 md:w-1/2">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-300">
          <Briefcase size={24} className={PRIMARY_COLOR} />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600">{project.client}</p>
          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 space-x-3">
            <span className="flex items-center">
              <MapPin size={12} className="mr-1" />
              {project.location}
            </span>
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {project.date}
            </span>
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              {project.loggedHours}h logged
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Block (Right) */}
      <div className="grid grid-cols-2 gap-4 md:flex md:space-x-8 md:items-center md:justify-end">
        <div className="flex flex-col items-start md:items-end">
          <StatusBadge status={project.status} />
        </div>
        <div className="hidden md:block">
          <ProfitMetrics
            margin={project.profitMargin}
            profit={project.grossProfit}
            revenue={project.revenue}
          />
        </div>
        <div className="hidden md:block">
          <BURMetrics bur={project.bur} burHours={project.burHours} />
        </div>
        {/* Combined Mobile Metrics */}
        <div className="col-span-2 md:hidden grid grid-cols-2 gap-4 border-t pt-2 mt-2 border-gray-200 w-full">
          <ProfitMetrics
            margin={project.profitMargin}
            profit={project.grossProfit}
            revenue={project.revenue}
          />
          <BURMetrics bur={project.bur} burHours={project.burHours} />
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the Projects Summary Footer/Banner.
 */
const ProjectSummaryFooter = ({ summary }) => (
  <div
    className={`mt-8 p-4 md:p-6 rounded-xl ${ACCENT_COLOR} text-white shadow-xl`}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      {/* Summary Metrics */}
      <div>
        <p className="text-sm font-medium opacity-80">Total Projects</p>
        <p className="text-2xl font-bold mt-1">{summary?.totalProjects ?? 0}</p>
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">Total Revenue</p>
        <p className="text-2xl font-bold mt-1">
          {formatNaira(summary?.totalRevenue)}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">Total Profit</p>
        <p className="text-2xl font-bold mt-1">
          {formatNaira(summary?.totalProfit)}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium opacity-80">Avg. Margin</p>
        <p className="text-2xl font-bold mt-1">{summary?.avgMargin ?? 0}%</p>
      </div>
    </div>
  </div>
);

/**
 * Renders the main content for the Projects Tab.
 */
const ProjectsTabContent = ({ projects, summary }) => (
  <div className="mt-6">
    {/* Projects Header & Action */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <p className="text-sm text-gray-600">
          Track profitability and performance across all projects
        </p>
      </div>
      <button
        className={`flex items-center space-x-2 ${ACCENT_COLOR} text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors`}>
        <Plus size={ICON_SIZE_SM} />
        <span>New Project</span>
      </button>
    </div>

    {/* Filter & Search Bar */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      {/* Search Input */}
      <div className="relative col-span-1 md:col-span-1">
        <input
          type="text"
          placeholder="Search projects or clients..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400"
        />
        <Search
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm">
          <option className="bg-white">All Statuses</option>
          <option className="bg-white">Active</option>
          <option className="bg-white">Completed</option>
          <option className="bg-white">Archived</option>
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Location Filter */}
      <div className="relative">
        <select className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm">
          <option className="bg-white">All Locations</option>
          <option className="bg-white">LCT-001</option>
          <option className="bg-white">LCT-002</option>
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>

    {/* Project List */}
    <div className="space-y-4">
      {projects?.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>

    {/* Summary Footer */}
    <ProjectSummaryFooter summary={summary} />
  </div>
);

// STAFF UTILIZATION HELPER COMPONENTS

const UtilizationMetricCard = ({
  title,
  value,
  subText,
  icon: Icon,
  valueColor,
  footerText,
}) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-3">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      {Icon && <Icon size={18} className="text-gray-400" />}
    </div>

    {/* Main Value */}
    <div className={`text-2xl font-bold ${valueColor || "text-gray-900"}`}>
      {value}
    </div>

    {footerText && <p className="text-xs text-gray-700 mt-1">{footerText}</p>}
    {subText && <p className="text-sm text-gray-700 mt-0.5">{subText}</p>}
  </div>
);

const StaffMemberPerformance = ({ staff }) => {
  const burColor =
    staff.bur >= 80
      ? "text-green-700 bg-green-100"
      : "text-yellow-700 bg-yellow-100";
  const burWidth = `${staff.bur}%`;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{staff.name}</h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${burColor}`}>
          BUR: {staff.bur}%
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {staff.projects} projects · {staff.timeEntries} time entries
      </p>

      {/* Time Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 text-center mb-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-xl font-bold text-gray-900">{staff.totalTime}h</p>
          <p className="text-xs text-gray-700">Total Time</p>
        </div>
        <div>
          <p className="text-xl font-bold text-green-600">{staff.billable}h</p>
          <p className="text-xs text-green-600">
            Billable ({Math.round((staff.billable / staff.totalTime) * 100)}%)
          </p>
        </div>
        <div>
          <p className="text-xl font-bold text-red-600">{staff.nonBillable}h</p>
          <p className="text-xs text-red-600">
            Non-Billable (
            {Math.round((staff.nonBillable / staff.totalTime) * 100)}%)
          </p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">
            {formatNaira(staff.internalCost)}
          </p>
          <p className="text-xs text-gray-700">Internal Cost</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: burWidth }}></div>
      </div>
    </div>
  );
};

/**
 * Renders the main content for the Staff Utilization Tab.
 */
const StaffUtilizationContent = ({
  staffData,
  summary,
  projects,
  timePeriods,
}) => {
  // Use optional chaining for default state if data isn't loaded yet
  const [timePeriod, setTimePeriod] = useState(
    timePeriods?.[0]?.value || "30d"
  );
  const [selectedProject, setSelectedProject] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const projectOptions = [{ id: "all", name: "All Projects" }, ...projects];

  // Common input/select classes
  const inputClasses =
    "w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-400";

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      timePeriod,
      startDate,
      endDate,
      selectedProject,
    });
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Users size={24} className="mr-2 text-indigo-600" />
          Staff Utilization Report
        </h2>
        <p className="text-sm text-gray-600">
          Track billable utilization and non-billable costs by team member
        </p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Time Period Dropdown */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Time Period
          </label>
          <div className="relative">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className={inputClasses}>
              {timePeriods?.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Custom Start Date */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Custom Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClasses.replace("pr-10", "pr-4")}
          />
        </div>

        {/* Custom End Date */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Custom End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClasses.replace("pr-10", "pr-4")}
          />
        </div>

        {/* Project Dropdown */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">
            Project
          </label>
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={inputClasses}>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleApplyFilters}
          className={`
                        flex items-center space-x-2 
                        ${ACCENT_COLOR} text-white font-semibold py-2 px-6 rounded-xl shadow-lg 
                        hover:bg-indigo-700 transition-colors
                    `}>
          Apply Filters
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <UtilizationMetricCard
          title="Team Members"
          value={summary?.teamMembers ?? 0}
          footerText={`${summary?.timeEntries ?? 0} time entries`}
          icon={Users}
        />
        <UtilizationMetricCard
          title="Total Time"
          value={`${summary?.totalTimeHours ?? 0}h`}
          subText={`${summary?.billableHours ?? 0}h billable`}
          icon={Clock}
        />
        <UtilizationMetricCard
          title="Avg. BUR"
          value={`${summary?.avgBUR ?? 0}%`}
          subText="Target: ≥ 80%"
          valueColor={
            (summary?.avgBUR ?? 0) >= 80 ? "text-green-600" : "text-yellow-600"
          }
          icon={TrendingUp}
        />
        <UtilizationMetricCard
          title="Non-Billable Cost"
          value={formatNaira(summary?.nonBillableCost)}
          subText={`${
            (summary?.totalTimeHours ?? 0) - (summary?.billableHours ?? 0)
          }h non-billable`}
          valueColor={
            (summary?.nonBillableCost ?? 0) > 0
              ? "text-red-600"
              : "text-gray-900"
          }
          icon={XCircle}
        />
      </div>

      {/* Individual Performance Section */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Individual Performance
      </h3>
      <div className="space-y-6">
        {staffData?.map((staff, index) => (
          <StaffMemberPerformance key={index} staff={staff} />
        ))}
      </div>

      {/* BUR Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 text-sm mb-1">
              About Billable Utilization Rate (BUR)
            </p>
            <p className="text-xs text-blue-700">
              BUR measures the percentage of total logged time that is billable
              to clients. A target of ≥80% is recommended for service staff.
              Non-billable time includes internal meetings, administrative work,
              and training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN DASHBOARD COMPONENT

const ProjectDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beapOnelite/project");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Failed to fetch project data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
                flex-1 text-center py-2 px-4 transition-all text-sm font-semibold rounded-full
                ${
                  activeTab === id
                    ? `bg-white text-gray-900 shadow-md`
                    : `text-gray-600 hover:text-gray-900`
                }
            `}>
      {label}
    </button>
  );

  // Loading State
  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading Project Data...</p>
      </div>
    );
  }

  // Safe Data Access
  const projectData = data?.projectData ?? [];
  const summaryData = data?.summaryData ?? {};
  const utilizationSummary = data?.utilizationSummary ?? {};
  const staffData = data?.staffData ?? [];
  const timePeriods = data?.timePeriods ?? [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-200 p-1 rounded-full shadow-inner w-full border border-gray-300">
          <TabButton id="projects" label="Projects" />
          <TabButton id="utilization" label="Staff Utilization" />
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        {activeTab === "projects" && (
          <ProjectsTabContent projects={projectData} summary={summaryData} />
        )}

        {activeTab === "utilization" && (
          <StaffUtilizationContent
            staffData={staffData}
            summary={utilizationSummary}
            projects={projectData}
            timePeriods={timePeriods}
          />
        )}
      </div>
    </div>
  );
};

// Wrapper Component for Layout integration
const ProjectDashboardWrapper = () => (
  <Layout>
    <ProjectDashboard />
  </Layout>
);

export default ProjectDashboardWrapper;
