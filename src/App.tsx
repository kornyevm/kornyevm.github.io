import ChartDashboard from "@/components/chart-dashboard/ChartDashboard.tsx"

function App() {
  return (
    <div className='xl:px-36 lg:px-32 md:px-24 sm:px-8 px-5 py-5'>
      <ChartDashboard />

      <div className='text-center text-xs text-gray-300 mb-5'>
        © Maksym Kornyev | <a target='_blank' href='https://github.com/mkornyev'>github</a> | <a target='_blank' href='https://www.linkedin.com/in/mkornyev/'>linkedin</a>
      </div>
    </div>
  )
}

export default App
