'use client';

import { useRecordStore } from '../../store/recordStore';

const RecordItem: React.FC = () => {
  const { 
    selectedRecord: record, 
    updateRecord, 
    loading,
    error, 
    setLoading,
    setError
  } = useRecordStore();

  const handleDecode = async () => {
    if (!record?.audioUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audio/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: record.audioUrl }),
      });
      if (!res.ok) throw new Error('Failed to decode');
      const data = await res.json();
      if (record) {
        const updateRes = await fetch('/api/records', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: record.id, decodedText: data.text }),
        });
        if (!updateRes.ok) throw new Error('Failed to update record with decoded text');
        const updatedRecord = await updateRes.json();
        updateRecord(updatedRecord);
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
    <div className="w-full sm:w-2/3 p-4 h-auto sm:h-full overflow-y-auto min-h-0">
      <h2 className="text-xl font-bold mb-4 break-words whitespace-normal">{record.title}</h2>
      {record.audioUrl && (
        <div>
          <h3 className="text-lg font-semibold my-4">Audio Playback</h3>
          <audio controls src={record.audioUrl} className="w-full mb-4"></audio>
          <button
            className="w-full mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleDecode}
            disabled={loading || !!record.decodedText}
          >
            {loading ? 'Decoding...' : (record.decodedText ? 'Decoded' : 'Decode')}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {record.decodedText && (
            <div className="mt-4 p-2 border rounded">
              <h4 className="font-semibold mb-2">Decoded Text:</h4>
              <pre className="whitespace-pre-wrap">{record.decodedText}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordItem; 