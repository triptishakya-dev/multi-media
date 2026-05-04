export default function MainScreen() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-black">Upload Complete</h1>
      <p className="text-gray-500 max-w-sm">
        Your documents have been uploaded successfully and are ready to be processed.
      </p>
    </section>
  );
}
