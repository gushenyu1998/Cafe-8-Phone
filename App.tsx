import HomeScreen from "./Screens/HomeScreen";
import {AppContextProvider} from "./Utils/AppContext";

export default function App() {
    return (
        <AppContextProvider>
            <HomeScreen/>
        </AppContextProvider>
    );
}