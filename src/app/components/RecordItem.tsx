'use client';

import { useState, useEffect } from 'react';

interface Record {
  id: string;
  userId: string;
  title: string;
  audioUrl?: string;
  decodedText?: string;
}

interface RecordItemProps {
  record: Record | null;
  onUpdateRecord: (record: Record) => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onUpdateRecord }) => {
  const [localDecodedText, setLocalDecodedText] = useState<string | null>(record?.decodedText || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalDecodedText(record?.decodedText || null);
  }, [record]);

  const handleDecode = async () => {
    if (!record?.audioUrl) return;
    setLoading(true);
    setError(null);
    setLocalDecodedText(null);
    try {
      const res = await fetch('/api/audio/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: record.audioUrl }),
      });
      if (!res.ok) throw new Error('Failed to decode');
      const data = await res.json();
      setLocalDecodedText(data.text || '');
      if (record) {
        const updateRes = await fetch('/api/records', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: record.id, decodedText: data.text }),
        });
        if (!updateRes.ok) throw new Error('Failed to update record with decoded text');
        const updatedRecord = await updateRes.json();
        onUpdateRecord(updatedRecord);
      }
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!record) {
    return (
      <div className="w-2/3 p-4 flex items-center justify-center">
        <p className="text-gray-500">Select a record to view its details or add a new record</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 p-4 h-full overflow-y-auto min-h-0">
      <h2 className="text-xl font-bold mb-4">Record Details</h2>
      <p className="break-words whitespace-normal">Title: {record.title}</p>
      <p>ID: {record.id}</p>
      <p>User ID: {record.userId}</p>
      {record.audioUrl && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Audio Playback</h3>
          <audio controls src={record.audioUrl} className="w-full"></audio>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleDecode}
            disabled={loading || !!record.decodedText}
          >
            {loading ? 'Decoding...' : (record.decodedText ? 'Decoded' : 'Decode')}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {(localDecodedText || record.decodedText) && (
            <div className="mt-4 p-2 border rounded">
              <h4 className="font-semibold mb-2">Decoded Text:</h4>
              <pre className="whitespace-pre-wrap">{localDecodedText || record.decodedText}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordItem; 