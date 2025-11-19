import React from 'react';

// ----------------------
// BAR CHART (JSX VERSION)
// ----------------------
export const BarChart = ({ records }) => {
  const chartData = (records || []).slice(0, 8);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        No data available. Add records to see the chart.
      </div>
    );
  }

  const maxValue = Math.max(...chartData.map(r => r.mark), 1);

  return (
    <div className="h-80 flex flex-col justify-end gap-4">
      <div className="flex items-end justify-around gap-2 h-full">
        {chartData.map((record, index) => {
          const percentage = (record.mark / maxValue) * 100;

          return (
            <div
              key={record._id || index}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div className="relative w-full h-64 bg-gray-100 rounded-lg flex items-end justify-center overflow-hidden group">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-500 flex items-end justify-center pb-2"
                  style={{ height: `${percentage}%` }}
                >
                  <span className="text-white font-bold text-sm">{record.mark}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900 truncate w-full">
                  {record.subject}
                </p>
                <p className="text-xs text-gray-500">{record.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------
// PIE CHART (JSX VERSION)
// ----------------------
export const PieChart = ({ records }) => {
  if (!records || !records.length) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        No data available. Add records to see the chart.
      </div>
    );
  }

  const subjectCounts = records.reduce((acc, record) => {
    acc[record.subject] = (acc[record.subject] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(subjectCounts).reduce((a, b) => a + b, 0);

  const colors = [
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#6366F1',
    '#14B8A6',
    '#F97316',
  ];

  let currentAngle = 0;
  const slices = Object.entries(subjectCounts).map(([subject, count], index) => {
    const sliceAngle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      subject,
      count,
      pathData,
      color: colors[index % colors.length],
      percentage: Math.round((count / total) * 100),
    };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-80">
      <svg viewBox="0 0 100 100" className="w-48 h-48">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            className="hover:opacity-80 transition cursor-pointer"
          />
        ))}
      </svg>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-gray-700">
              {slice.subject} ({slice.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
