'use client';

import { useState, useEffect, useRef } from 'react';
import RecordList from './components/RecordList';

import AddRecord from './components/AddRecord';
import RecordItem from './components/RecordItem';

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

      if (res.status === 402) {
        const checkoutRes = await fetch('/api/records/checkout', {
          method: 'POST',
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to create record');
      }

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

  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord(null);
        }
      } else {
        console.error('Failed to delete record');
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleUpdateRecord = (updatedRecord: Record) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
    );
    if (selectedRecord && selectedRecord.id === updatedRecord.id) {
      setSelectedRecord(updatedRecord);
    }
  };

  return (
    <main className="flex flex-1 flex-row min-h-0">
      <RecordList 
        records={records} 
        onSelectRecord={handleSelectRecord} 
        onAddRecord={handleAddRecord}
        onDeleteRecord={handleDeleteRecord}
      />
      {isAddingNewRecord ? (
        <AddRecord
          newRecordTitle={newRecordTitle}
          setNewRecordTitle={setNewRecordTitle}
          audioFileRef={audioFileRef}
          onSubmit={handleSubmitNewRecord}
        />
      ) : (
        <RecordItem
          record={selectedRecord}
          onUpdateRecord={handleUpdateRecord}
        />
      )}
    </main>
  );
}
