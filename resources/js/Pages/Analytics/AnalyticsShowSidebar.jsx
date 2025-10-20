import { Head, Link } from "@inertiajs/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF1493'];

export default function AnalyticsShowSidebar({
  isOpen,
  onClose,
  projectID
}) {
  const [group, setGroup] = useState(null);
  const [filter, setFilter] = useState("today");
  const [views, setView] = useState(null);
  const [tabs, setTabs] = useState(null);
  const [questionStats, setQuestionStats] = useState(null);
  const [questionBreakdown, setQuestionBreakdown] = useState(null);

  const [loading, setLoading] = useState(true);
  const hasViews = views?.length > 0;
  const hasTabs = tabs?.length > 0;
  const hasQuestionStats = questionStats?.length > 0;
  const hasQuestionBreakdown = questionBreakdown?.length > 0;

  const filters = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'this_week', label: 'This Week' },
    { key: 'last_week', label: 'Last Week' },
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'this_year', label: 'This Year' },
    { key: 'last_year', label: 'Last Year' },
  ];

  useEffect(() => {
    if (projectID)
      fetchData(projectID);
  }, [projectID, filter])
  const fetchData = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/analytics/view/${id}/${filter}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setGroup(res.data.group);
      setQuestionBreakdown(res.data.questionBreakdown);
      setView(res.data.views);
      setTabs(res.data.tabs)
      setQuestionStats(res.data.questionStats);
      console.log(res);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err.response?.data || err);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark background overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-in sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-1/2 bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto rounded-l-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <Head title="Analytics" />

            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
              <h2 className="text-xl flex items-center justify-center gap-2 font-semibold text-gray-800 dark:text-gray-100">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>  {group?.title || "Untitled"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === f.key
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Page Views */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">
                  Page Views
                </h3>
                {hasViews ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={views}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ fill: "#8884d8" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No page view data available.
                  </p>
                )}
              </div>

              {/* Tabs Pie */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">
                  Tab Interactions
                </h3>
                {hasTabs ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tabs}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ tab_name, percent }) =>
                          `${tab_name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="tab_name"
                      >
                        {tabs.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No tab data available.
                  </p>
                )}
              </div>

              {/* Question Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">
                  Question & Answer Results
                </h3>
                {hasQuestionStats ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={questionStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ label, percent }) =>
                          `${label} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        dataKey="total"
                        nameKey="label"
                      >
                        {questionStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No question data available.
                  </p>
                )}
              </div>

              {/* Per-question Breakdown */}
              {hasQuestionBreakdown ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-x-auto">
                  <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">
                    Per-Question Performance
                  </h3>
                  <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <th className="py-2 px-4 text-left">Question</th>
                        <th className="py-2 px-4 text-center">Correct</th>
                        <th className="py-2 px-4 text-center">Incorrect</th>
                        <th className="py-2 px-4 text-center">Attempts</th>
                        <th className="py-2 px-4 text-center">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionBreakdown.map((q, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-800"
                            : "bg-white dark:bg-gray-900"
                            } border-t border-gray-200 dark:border-gray-700`}
                        >
                          <td className="py-2 px-4 dark:text-white">{q.question_title}</td>
                          <td className="py-2 px-4 text-center text-green-600 font-semibold">
                            {q.correct_count}
                          </td>
                          <td className="py-2 px-4 text-center text-red-600 font-semibold">
                            {q.incorrect_count}
                          </td>
                          <td className="py-2 px-4 text-center text-gray-600 dark:text-gray-400">
                            {q.total_attempts}
                          </td>
                          <td className="py-2 px-4 text-center font-semibold">
                            <span
                              className={`${q.accuracy >= 80
                                ? "text-green-600"
                                : q.accuracy >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                                }`}
                            >
                              {q.accuracy}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No per-question breakdown data.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
