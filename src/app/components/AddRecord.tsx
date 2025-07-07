interface AddRecordProps {
  newRecordTitle: string;
  setNewRecordTitle: (title: string) => void;
  audioFileRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddRecord({ newRecordTitle, setNewRecordTitle, audioFileRef, onSubmit }: AddRecordProps) {
  return (
    <div className="w-full sm:w-2/3 p-4 sm:border-l h-auto sm:h-full overflow-y-auto min-h-0">
      <h2 className="text-xl font-bold mb-4">Add New Record</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Record Title"
          value={newRecordTitle}
          onChange={(e) => setNewRecordTitle(e.target.value)}
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
        >
          Create Record
        </button>
      </form>
    </div>
  );
} 