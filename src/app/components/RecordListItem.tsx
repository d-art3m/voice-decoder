'use client';

import { Record, useRecordStore } from '../../store/recordStore';

interface RecordListItemProps {
  record: Record;
}

const RecordListItem: React.FC<RecordListItemProps> = ({ record }) => {
  const { 
    selectRecord, 
    deleteRecord, 
    selectedRecord
  } = useRecordStore();

  const selected = selectedRecord?.id === record.id;

  return (
    <li
      className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors hover:bg-gray-800 ${selected ? 'bg-blue-900' : ''}`}
      onClick={() => selectRecord(record)}
    >
      <span className="flex-1 truncate max-w-[180px]">{record.title}</span>
      <button
        onClick={e => {
          e.stopPropagation();
          deleteRecord(record.id);
        }}
        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
      >
        Delete
      </button>
    </li>
  );
};

export default RecordListItem; 