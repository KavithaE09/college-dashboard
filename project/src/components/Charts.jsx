import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// Vibrant gradient colors for bar chart - each bar gets a different color
const BAR_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#A855F7', // Violet
  '#3B82F6', // Blue
];

// Specific colors for pie chart performance categories
const PIE_COLORS = {
  'Excellent (80+)': '#8B5CF6',           // Purple
  'Good (60-79)': '#F59E0B',              // Amber/Orange
  'Average (50-59)': '#10B981',           // Emerald/Green
  'Needs Improvement (<50)': '#EF4444',  // Red
};

// Helper function to get pie color based on category name
const getPieColor = (name) => {
  for (const key in PIE_COLORS) {
    if (name.includes(key) || name === key) {
      return PIE_COLORS[key];
    }
  }
  return '#6B7280'; // Default gray
};

export const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="font-medium">No data available</p>
          <p className="text-sm text-gray-400 mt-1">Add records to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBar data={data}>
        <defs>
          {data.map((entry, index) => (
            <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BAR_COLORS[index % BAR_COLORS.length]} stopOpacity={1} />
              <stop offset="100%" stopColor={BAR_COLORS[index % BAR_COLORS.length]} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="subject" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Bar 
          dataKey="mark" 
          radius={[8, 8, 0, 0]}
          name="Mark"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#barGradient-${index})`}
            />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="font-medium">No data available</p>
          <p className="text-sm text-gray-400 mt-1">Add records to see the chart</p>
        </div>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="14"
      >
        {value}
      </text>
    );
  };

  const renderLegend = (value, entry) => {
    return <span style={{ color: '#374151', fontWeight: 500 }}>{value}</span>;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPie>
        <defs>
          {data.map((entry, index) => {
            const color = getPieColor(entry.name);
            return (
              <linearGradient key={`pieGradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.8} />
              </linearGradient>
            );
          })}
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#pieGradient-${index})`}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '12px'
          }}
          itemStyle={{ fontWeight: 500 }}
        />
        <Legend 
          verticalAlign="bottom"
          height={36}
          formatter={renderLegend}
          iconType="circle"
        />
      </RechartsPie>
    </ResponsiveContainer>
  );
};