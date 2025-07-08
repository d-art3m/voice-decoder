'use client';

import { useRef, useState } from 'react';
import { useRecordStore } from '../../store/recordStore';

export default function AddRecord() {
  const [title, setTitle] = useState('');
  const audioFileRef = useRef<HTMLInputElement | null>(null);
  const { addNewRecord, loading, error, resetError } = useRecordStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNewRecord(title, audioFileRef);
    setTitle('');
    if (audioFileRef.current) audioFileRef.current.value = '';
  };

  return (
    <div className="w-full sm:w-2/3 p-4 sm:border-l h-auto sm:h-full overflow-y-auto min-h-0">
      <h2 className="text-xl font-bold mb-4">Add New Record</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Record Title"
          value={title}
          onChange={(e) => { 
            setTitle(e.target.value); 
            if (error) resetError(); 
          }}
          className="p-2 border rounded-md"
          maxLength={30}
          required
        />
        <input
          type="file"
          accept="audio/*"
          ref={audioFileRef}
          className="p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Record'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
} 