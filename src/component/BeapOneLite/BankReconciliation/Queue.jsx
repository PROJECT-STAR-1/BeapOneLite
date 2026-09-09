'use client';

import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";

// Define the component to accept 'data' as a prop
export default function Queue({ data }) {
  // Extract unmatchedLines from props, using an empty array as a safe fallback
  const initialLines = data?.unmatchedLines || [];
  const oneClickOptions = data?.oneClickOptions || [];
  
  // Use the fetched data as the initial state for the list that can change
  const [unmatched, setUnmatched] = useState(initialLines);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // IMPORTANT: Reset the 'unmatched' state whenever the incoming 'data' prop changes,
  // ensuring that the local state is always initialized with the prop data.
  // This is crucial if the parent component re-fetches the data.
  useEffect(() => {
    setUnmatched(initialLines);
  }, [data]);

  // SEARCH FILTER
  const filtered = unmatched.filter((item) =>
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  // RESOLVE = REMOVE ITEM
  const resolveLine = () => {
    if (!selected) return;
    setUnmatched((prev) => prev.filter((x) => x.id !== selected.id));
    setSelected(null);
  };

  // SKIP = DO NOT REMOVE, ONLY DESELECT
  const skipLine = () => {
    setSelected(null);
  };

  return (
    <div className="w-full p-6">

      {/* ==== HEADER WITH SEARCH ==== */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Reconciliation Queue</h2>
          <p className="text-gray-500 text-sm">
            {unmatched.length} unmatched statement lines awaiting action
          </p>
        </div>

        <div className="relative w-60">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search lines..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ==== MAIN GRID ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT PANEL: UNMATCHED LINES */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-yellow-500 h-5 w-5" />
            <span className="font-semibold text-gray-600">
              Unmatched Lines ({filtered.length})
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className={`cursor-pointer p-4 rounded-lg border flex items-start justify-between ${
                  selected?.id === item.id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div>
                  <div
                    className={`font-bold text-lg flex items-center gap-2 ${
                      item.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.type === "credit" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    ₦{item.amount.toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-700 mt-1">
                    {item.desc}
                  </div>

                  <div className="text-xs text-gray-500 mt-2 flex gap-2">
                    <span>{item.date}</span>•<span>{item.ref}</span>
                  </div>
                </div>

                {/* Placeholder for potential match count/confidence */}
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">
                  1
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No unmatched lines match your search query.
                </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: ACTIONS */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500"><Zap size={18}/></span>
            <span className="font-semibold text-gray-600">
              Matching & Actions
            </span>
          </div>

          {/* EMPTY STATE */}
          {!selected ? (
            <div className="text-gray-400 text-center mt-20">
              <p className="font-medium">Select a statement line</p>
              <p className="text-sm mt-1">
                Choose a line from the left to see matching options.
              </p>
            </div>
          ) : (
            <>
              {/* SELECTED CARD */}
              <div className="bg-indigo-900 text-white p-4 rounded-lg relative">
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full ${
                    selected.type === "credit"
                      ? "bg-green-300 text-green-900"
                      : "bg-yellow-300 text-yellow-900"
                  }`}
                >
                  {selected.type === "credit" ? "Credit" : "Debit"}
                </span>

                <div className="text-sm opacity-80">Selected Transaction</div>

                <div className="text-3xl font-bold mt-2">
                  ₦{selected.amount.toLocaleString()}
                </div>

                <div className="text-xs mt-2 opacity-80">{selected.desc}</div>

                <div className="flex text-xs gap-2 opacity-70 mt-2">
                  <span>{selected.date}</span>•<span>{selected.ref}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5">
                <p className="font-semibold flex gap-2 items-center"> <Zap size={14}/> One-Click Record as Expense</p>
                <p className="text-xs text-gray-500 mb-3">
                  Can't find a match? Create a new expense record instantly.
                </p>

                <div className="grid grid-cols-2 gap-3 font-medium">
                  {/* Dynamic rendering of options from the JSON data */}
                  {oneClickOptions.map(
                    (label) => (
                      <button
                        key={label}
                        onClick={resolveLine}
                        className="border py-2 rounded-md hover:bg-gray-100"
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>

                {/* NOTE FIELD */}
                <label className="block text-sm font-semibold mt-4 mb-1">
                  Add Note (Optional)
                </label>
                <textarea
                  placeholder="Reason for manual match or any relevant context..."
                  className="w-full border rounded-md p-2 text-sm"
                />

                {/* SKIP BUTTON (NOW DOES NOT RESOLVE) */}
                <button
                  onClick={skipLine}
                  className="mt-3 w-full py-2 border rounded-md bg-gray-50 hover:bg-gray-100 font-medium"
                >
                  Skip for Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}