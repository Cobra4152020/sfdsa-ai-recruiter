export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EE] dark:bg-[#121212]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0A3C1F] border-r-transparent dark:border-[#FFD700] dark:border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[#0A3C1F] dark:text-[#FFD700]">Loading...</p>
        </div>
      </div>
    )
  }
  