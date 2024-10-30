import Auth from './Auth'

function App() {
  console.log(import.meta.env.VITE_PB_URL)
  return (
    <>
      <Auth />
    </>
  )
}

export default App
