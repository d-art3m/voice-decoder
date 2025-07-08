import { create } from 'zustand';

export interface Record {
  id: string;
  userId: string;
  title: string;
  audioUrl?: string;
  decodedText?: string;
}

interface RecordStore {
  records: Record[];
  selectedRecord: Record | null;
  isAddingNewRecord: boolean;
  loading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  selectRecord: (record: Record) => void;
  setAddRecordMode: () => void;
  addNewRecord: (title: string, audioFileRef: React.RefObject<HTMLInputElement | null>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  updateRecord: (updatedRecord: Record) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
}

export const useRecordStore = create<RecordStore>((set, get) => ({
  records: [],
  selectedRecord: null,
  isAddingNewRecord: false,
  loading: false,
  error: null,

  fetchRecords: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch('/api/records');
      const data = await res.json();
      set({ records: data, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch records' });
    }
  },

  selectRecord: (record) => set({ selectedRecord: record, isAddingNewRecord: false }),
  setAddRecordMode: () => set({ isAddingNewRecord: true, selectedRecord: null }),

  addNewRecord: async (title, audioFileRef) => {
    set({ loading: true, error: null });
    try {
      let audioUrl: string | undefined;
      if (audioFileRef?.current?.files && audioFileRef.current.files.length > 0) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, audioUrl }),
      });
      if (res.status === 402) {
        const checkoutRes = await fetch('/api/records/checkout', { method: 'POST' });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
        set({ loading: false });
        return;
      }
      if (!res.ok) throw new Error('Failed to create record');
      const newRecord = await res.json();
      set((state) => ({
        records: [...state.records, newRecord],
        isAddingNewRecord: false,
        selectedRecord: newRecord,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to add record' });
    }
  },

  deleteRecord: async (id) => {
    set({ loading: true, error: null });
    const { selectedRecord } = get();
    try {
      const res = await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
          selectedRecord: selectedRecord && selectedRecord.id === id ? null : selectedRecord,
          loading: false,
        }));
      } else {
        set({ loading: false, error: 'Failed to delete record' });
      }
    } catch (error) {
      set({ loading: false, error: 'Failed to delete record' });
    }
  },

  updateRecord: (updatedRecord) => {
    set((state) => ({
      records: state.records.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      ),
      selectedRecord:
        state.selectedRecord && state.selectedRecord.id === updatedRecord.id
          ? updatedRecord
          : state.selectedRecord,
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
})); 