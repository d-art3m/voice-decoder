'use client';

import { useEffect } from 'react';
import { useRecordStore } from '../../store/recordStore';
import RecordListItem from './RecordListItem';

const RecordList: React.FC = () => {
  const { 
    records, 
    setAddRecordMode, 
    fetchRecords,
  } = useRecordStore();

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="w-full sm:w-1/3 flex-shrink-0 p-4 sm:border-r border-b sm:border-b-0 border-gray-700 h-64 sm:h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold">Record List</h2>
        <button 
          onClick={setAddRecordMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add +
        </button>
      </div>
      <ul className="overflow-y-auto min-h-0 flex-1 record-list-scroll">
        {records.map((record) => (
          <RecordListItem
            key={record.id}
            record={record}
          />
        ))}
      </ul>
    </div>
  );
};

export default RecordList; 