'use client';

interface Record { 
  id: string;
  userId: string;
  title: string;
}

interface RecordListProps {
  records: Record[];
  onSelectRecord: (record: Record) => void;
  onAddRecord: () => void;
  onDeleteRecord: (id: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ records, onSelectRecord, onAddRecord, onDeleteRecord }) => {
  return (
    <div className="w-full sm:w-1/3 flex-shrink-0 p-4 sm:border-r border-b sm:border-b-0 border-gray-300 h-64 sm:h-full overflow-y-auto min-h-0">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold">Record List</h2>
        <button 
          onClick={onAddRecord}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add +
        </button>
      </div>
      <ul>
        {records.map((record) => (
          <li
            key={record.id}
            className="group flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
            onClick={() => onSelectRecord(record)}
          >
            <span className="flex-1 truncate max-w-[180px]">{record.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteRecord(record.id); }}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList; 