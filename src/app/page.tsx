'use client';

import RecordList from './components/RecordList';
import AddRecord from './components/AddRecord';
import RecordItem from './components/RecordItem';
import { useRecordStore } from '../store/recordStore';

export default function Home() {
  const { isAddingNewRecord } = useRecordStore();

  return (
    <main className="flex flex-1 flex-col sm:flex-row min-h-0 h-full">
      <RecordList />
      {isAddingNewRecord ? <AddRecord /> : <RecordItem />}
    </main>
  );
}
