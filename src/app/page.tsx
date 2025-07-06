'use client';

import { useState, useEffect, useRef } from 'react';
import RecordList from './components/RecordList';
import RecordDetail from './components/RecordDetail';

interface Record {
  id: string;
  userId: string;
  title: string;
  audioUrl?: string;
}

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [isAddingNewRecord, setIsAddingNewRecord] = useState(false);
  const audioFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records');
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };
    fetchRecords();
  }, []);

  const handleSelectRecord = (record: Record) => {
    setSelectedRecord(record);
    setIsAddingNewRecord(false);
  };

  const handleAddRecord = async () => {
    setIsAddingNewRecord(true);
    setSelectedRecord(null);
  };

  const handleSubmitNewRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let audioUrl: string | undefined;

      if (audioFileRef.current?.files && audioFileRef.current.files.length > 0) {
        const file = audioFileRef.current.files[0];
        const uploadRes = await fetch(`/api/audio/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });
        const uploadData = await uploadRes.json();
        audioUrl = uploadData.url;
      }

      const res = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newRecordTitle, audioUrl }),
      });
      const newRecord = await res.json();
      setRecords((prevRecords) => [...prevRecords, newRecord]);
      setNewRecordTitle('');
      if (audioFileRef.current) {
        audioFileRef.current.value = ''; // Clear the file input
      }
      setIsAddingNewRecord(false);
      setSelectedRecord(newRecord);
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-row items-start p-4">
      <RecordList 
        records={records} 
        onSelectRecord={handleSelectRecord} 
        onAddRecord={handleAddRecord}
      />
      <RecordDetail record={selectedRecord} />
      
      {isAddingNewRecord && (
        <div className="w-2/3 p-4 border-l">
          <h2 className="text-xl font-bold mb-4">Add New Record</h2>
          <form onSubmit={handleSubmitNewRecord} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Record Title"
              value={newRecordTitle}
              onChange={(e) => setNewRecordTitle(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
              type="file"
              accept="audio/*"
              ref={audioFileRef}
              className="p-2 border rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Create Record
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
