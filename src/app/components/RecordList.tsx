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
}

const RecordList: React.FC<RecordListProps> = ({ records, onSelectRecord, onAddRecord }) => {
  return (
    <div className="w-1/3 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Your Records</h2>
      <button 
        onClick={onAddRecord}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add New Record
      </button>
      <ul>
        {records.map((record) => (
          <li key={record.id} className="cursor-pointer py-2 hover:bg-gray-100" onClick={() => onSelectRecord(record)}>
            {record.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList; 