
import { LocalStorageAppStateContext } from "./context/LocalStorageAppStateContext"
import AppContent from "./components/AppContent";

function App() {

  return (
    <>
      {
        <LocalStorageAppStateContext>
          <AppContent />
        </LocalStorageAppStateContext>
      }
    </>

  );
}

export default App;