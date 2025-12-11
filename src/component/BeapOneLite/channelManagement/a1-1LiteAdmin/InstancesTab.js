"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Activity,
  MoreVertical,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const [instances, setInstances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProvisionForm, setShowProvisionForm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // NEW: Status filter states
  const [selectedStatus, setSelectedStatus] = useState("All Instances");
  const [statusDropdown, setStatusDropdown] = useState(false);

  // Fetch data
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/beapOnelite/a1-1LiteAdmin");
      const data = await res.json();
      setInstances(data.instances);
      setFiltered(data.instances);
      setLoading(false);
    };
    load();
  }, []);

  // NEW: Filter logic
  useEffect(() => {
    if (selectedStatus === "All Instances") {
      setFiltered(instances);
    } else {
      setFiltered(instances.filter((i) => i.status === selectedStatus));
    }
  }, [selectedStatus, instances]);


  // NEW: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".status-filter")) {
        setStatusDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );

  return (
    <div className="p-6 space-y-8">

      {/* ---------------------- Toolbar ---------------------- */}
      <div className="flex justify-between items-center">

        {/* STATUS FILTER */}
        <div className="relative status-filter">
          <button
            onClick={() => setStatusDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
          >
            {selectedStatus}
            <ChevronDown size={16} />
          </button>

          {statusDropdown && (
            <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-md z-20">
              {["All Instances", "ACTIVE", "SUSPENDED", "PROVISIONING"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* PROVISION BUTTON */}
        <button
          onClick={() => setShowProvisionForm(!showProvisionForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Provision New Instance
        </button>
      </div>

      {/* ---------------------- Provision Form ---------------------- */}
      {showProvisionForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Provision New BEAPOne Lite Instance (Flow 1)
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block font-medium">Client Email</label>
              <input
                type="email"
                defaultValue=""
                className="w-full p-2 border rounded-md"
                placeholder="admin@client.com"
              />
            </div>

            <div>
              <label className="block font-medium">Country</label>
              <select defaultValue="" className="w-full p-2 border rounded-md">
                <option value="">Select country</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Client Name</label>
              <input
                type="text"
                defaultValue=""
                className="w-full p-2 border rounded-md"
                placeholder="Client Business Name"
              />
            </div>

            <div>
              <label className="block font-medium">Subscription Tier</label>
              <select defaultValue="" className="w-full p-2 border rounded-md">
                <option value="">Select tier</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Initial Users</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium">Provisioning Note</label>
              <textarea
                rows="4"
                defaultValue=""
                className="w-full p-2 border rounded-md"
                placeholder="Justification for provisioning this instance"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Provision Instance
              </button>
              <button
                type="button"
                onClick={() => setShowProvisionForm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------- Table ---------------------- */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">App ID</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Active Users</th>
              <th className="py-3 px-4">Transactions</th>
              <th className="py-3 px-4">O17 Exposure</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row) => (
              <tr key={row.appId} className="border-t">

                {/* CLIENT NAME + EMAIL */}
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{row.clientName}</span>
                    <span className="text-sm text-gray-500">
                      {row.clientEmail}
                    </span>
                  </div>
                </td>

                {/* APP ID */}
                <td className="py-3 px-4 text-gray-700">{row.appId}</td>

                {/* STATUS BADGE */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      row.status === "ACTIVE"
                        ? "bg-green-200 text-green-700"
                        : row.status === "SUSPENDED"
                        ? "bg-red-200 text-red-700"
                        : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {row.status === "ACTIVE" && <CheckCircle size={14} />}
                    {row.status === "SUSPENDED" && <AlertTriangle size={14} />}
                    {row.status === "PROVISIONING" && <Activity size={14} />}
                    {row.status}
                  </span>
                </td>

                <td className="py-3 px-4">{row.activeUsers}</td>
                <td className="py-3 px-4">{row.transactions}</td>
                <td className="py-3 px-4">${row.O17Exposure}</td>

                {/* ACTION DROPDOWN */}
                <td className="relative py-3 px-4">
                  <button
                    onClick={() => toggleDropdown(row.appId)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openDropdown === row.appId && (
                    <div className="absolute right-4 mt-2 bg-white border rounded-md shadow-md w-40 z-20">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        View Instance
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Suspend
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
