import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF1493'];

export default function AnalyticsShow({ 
  group, 
  filter, 
  views, 
  tabs, 
  questionStats, 
  questionBreakdown,
  dateRange 
}) {
  
  // Add empty state checks
  const hasViews = views && views.length > 0;
  const hasTabs = tabs && tabs.length > 0;
  const hasQuestionStats = questionStats && questionStats.length > 0;
  const hasQuestionBreakdown = questionBreakdown && questionBreakdown.length > 0;
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

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-2">
          <Link
            href={route("dashboard")}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
          >
            ← Back
          </Link>
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
            Analytics for {group.title}
          </h2>
          {dateRange && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({dateRange.from} - {dateRange.to})
            </span>
          )}
        </div>
      }
    >
      <Head title="Analytics" />

      <div className="py-8 max-w-7xl mx-auto px-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <Link
              key={f.key}
              href={route('analytics.show', { id: group.id, filter: f.key })}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Views over time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">Page Views</h3>
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
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No page view data available for the selected period.
            </div>
          )}
        </div>

        {/* Tabs pie chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">Tab Interactions</h3>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No tab interaction data available for the selected period.
            </div>
          )}
        </div>

        {/* Question & Answer Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">Question & Answer Results</h3>
          {hasQuestionStats ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="total"
                  nameKey="label"
                >
                  {questionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No question data available for the selected period.
            </div>
          )}
        </div>

        {/* Per-question Breakdown */}
        {hasQuestionBreakdown ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8 overflow-x-auto">
            <h3 className="text-lg dark:text-gray-200 font-semibold mb-4">Per-Question Performance</h3>
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <th className="py-2 px-4 text-left">Question</th>
                  <th className="py-2 px-4 text-center">Correct</th>
                  <th className="py-2 px-4 text-center">Incorrect</th>
                  <th className="py-2 px-4 text-center">Total Attempts</th>
                  <th className="py-2 px-4 text-center">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {questionBreakdown.map((q, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    } border-t border-gray-200 dark:border-gray-700`}
                  >
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {q.question_title}
                    </td>
                    <td className="py-2 px-4 text-center text-green-600 font-semibold">
                      {q.correct_count}
                    </td>
                    <td className="py-2 px-4 text-center text-red-600 font-semibold">
                      {q.incorrect_count}
                    </td>
                    <td className="py-2 px-4 text-center text-gray-600 dark:text-gray-400 font-semibold">
                      {q.total_attempts}
                    </td>
                    <td className="py-2 px-4 text-center font-semibold">
                      <span className={`
                        ${q.accuracy >= 80 ? 'text-green-600' : 
                          q.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}
                      `}>
                        {q.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No per-question breakdown available for the selected period.
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}