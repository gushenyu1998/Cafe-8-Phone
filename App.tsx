import HomeScreen from "./Screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import {AppContextProvider} from "./Utils/AppContext";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DishSelection from "./Screens/DishSelection";
import TableSelection from "./Screens/TableSelection";
import {OneOrderType} from "./Config/TypeConfig";
import TagsSelectScreen from "./Screens/TagsSelection";
import {useEffect} from "react";
import {FetchAPI} from "./Utils/APIFetching";

export type RootStackParamList = {
    Home: undefined;
    TableSelection: undefined;
    DishSelection: undefined;
    TagsSelection: { data: OneOrderType, section: string[], price: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>()
export default function App() {
    return (
        <AppContextProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{title: "Home"}}
                        // options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="TableSelection"
                        component={TableSelection}
                        options={{title: "Select Table"}}
                    />
                    <Stack.Screen
                        name="DishSelection"
                        component={DishSelection}
                        options={{title: "Select Dish To Make"}}
                        // options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="TagsSelection"
                        component={TagsSelectScreen}
                        options={{title: "Select Tags"}}
                        // options={{headerShown: false}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AppContextProvider>
    );
}