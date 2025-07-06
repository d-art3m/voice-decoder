'use client';

import { useState } from 'react';

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
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = async () => {
    if (!record?.audioUrl) return;
    setLoading(true);
    setError(null);
    setDecodedText(null);
    try {
      const res = await fetch('/api/audio/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: record.audioUrl }),
      });
      if (!res.ok) throw new Error('Failed to decode');
      const data = await res.json();
      setDecodedText(data.text || '');
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

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
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleDecode}
            disabled={loading}
          >
            {loading ? 'Decoding...' : 'Decode'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {decodedText && (
            <div className="mt-4 p-2 border rounded">
              <h4 className="font-semibold mb-2">Decoded Text:</h4>
              <pre className="whitespace-pre-wrap">{decodedText}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordDetail; 