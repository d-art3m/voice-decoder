'use client';

interface Record {
  id: string;
  userId: string;
  title: string;
  audioUrl?: string;
}

interface RecordDetailProps {
  record: Record | null;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ record }) => {
  if (!record) {
    return (
      <div className="w-2/3 p-4 flex items-center justify-center">
        <p className="text-gray-500">Select a record to view its details or add a new record.</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-xl font-bold mb-4">Record Details</h2>
      <p>Title: {record.title}</p>
      <p>ID: {record.id}</p>
      <p>User ID: {record.userId}</p>
      {record.audioUrl && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Audio Playback</h3>
          <audio controls src={record.audioUrl} className="w-full"></audio>
        </div>
      )}
    </div>
  );
};

export default RecordDetail; 