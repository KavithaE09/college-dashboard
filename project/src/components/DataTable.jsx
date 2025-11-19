import React, { useState } from 'react';
import { Search, Trash2, ChevronUp, ChevronDown, Filter } from 'lucide-react';

export const DataTable = ({
  records,
  onDelete,
  onSearch,
  onSort,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterKey, setFilterKey] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
    onSort(key, newOrder);
  };

  const handleFilter = () => {
    if (filterKey && filterValue) {
      onFilter(filterKey, filterValue);
      setShowFilter(false);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <div className="w-4 h-4" />;

    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, department, or subject..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilter && (
          <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
            <select
              value={filterKey || ''}
              onChange={(e) => setFilterKey(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select field to filter</option>
              <option value="department">Department</option>
              <option value="subject">Subject</option>
              <option value="mark">Marks (Min)</option>
            </select>

            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Filter value"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">

              {/* Name */}
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600 transition"
                >
                  Name
                  <SortIcon column="name" />
                </button>
              </th>

              {/* Department */}
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600 transition"
                >
                  Department
                  <SortIcon column="department" />
                </button>
              </th>

              {/* Subject */}
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('subject')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600 transition"
                >
                  Subject
                  <SortIcon column="subject" />
                </button>
              </th>

              {/* Mark */}
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('mark')}
                  className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600 transition"
                >
                  Mark
                  <SortIcon column="mark" />
                </button>
              </th>

              <th className="px-6 py-3 text-center font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No records found. Add one to get started!
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {record.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {record.department}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {record.subject}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                      {record.mark}%
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this record?'
                          )
                        ) {
                          onDelete(record._id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition inline-block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-700">
          Showing {records.length} record
          {records.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
