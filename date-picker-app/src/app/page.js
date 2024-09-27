import DatePicker from "./components/DatePicker/DatePicker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        {/* Render the DatePicker component */}
        <DatePicker />
      </main>
    </div>
  );
}
