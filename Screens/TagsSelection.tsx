import React, {useContext, useEffect, useState} from "react";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    TextInput, FlatList, ActivityIndicator
} from "react-native";
import {AppContext} from "../Utils/AppContext";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {RouteProp} from "@react-navigation/native";
import TagsList from "../Components/TagsList";
import {determineColor, tagsPalette} from "../Config/Palette";
import SubmitButton from "../Components/Buttons/SubmitButton";
import {OneOrderType, TagsType} from "../Config/TypeConfig";
import Icon from "react-native-vector-icons/MaterialIcons";
import DataStore from "../Utils/DataStore";

type TagsSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TagsSelection'>;
type TagsSelectionRouteProp = RouteProp<RootStackParamList, 'TagsSelection'>;

interface TagsSelectionProps {
    navigation: TagsSelectionNavigationProp,
    route: TagsSelectionRouteProp
}

type TagsDemoType = {
    tags: [string, number][],
    delete_tag: (tag: [string, number]) => void
    submit_note: (text: string) => void
}
const TagsDemoAndNote: React.FC<TagsDemoType> = ({tags, delete_tag, submit_note}) => {
    const [note, setNote] = useState('');
    const handleNoteChange = (text: string) => {
        setNote(text);
        submit_note(text);
    };

    return (
        <View style={styles.demoContainer}>
            <View style={{...styles.tagsContainer,}}>
                {tags.map((tag, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            ...styles.tag,
                            backgroundColor: tagsPalette[determineColor(tag[0], 5) % tagsPalette.length]
                        }}
                        onPress={() => delete_tag(tag)}
                    >
                        <Text style={styles.tagText}>
                            {tag[0]}
                            <Icon name={'close'}/>
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Enter your note"
                value={note}
                onChangeText={handleNoteChange}
            />
        </View>
    );
}


export default function TagsSelectScreen(item: TagsSelectionProps): React.JSX.Element {
    const orderDataSection = item.route.params.section
    const defaultTags = item.route.params.data.tags
    const context = useContext(AppContext)
    const dataStore = DataStore.getInstance()
    const [selectedTags, setSelectedTags] = useState<[string, number][]>([])
    const [price, setPrice] = useState<number>(item.route.params.data.price)
    const [note, setNote] = useState('');
    const [tagList, setTagList] = useState<TagsType>({})

    useEffect(() => {
        //Deep Copy the Default Tags to the selected Tags (buffer)
        setSelectedTags(JSON.parse(JSON.stringify(defaultTags)))
        dataStore.getTags().then(tagList => setTagList(tagList))
    }, []);

    //add Tags to Buffer
    const addTag = (tag: [string, number]) => {
        const temp = [...selectedTags, tag]
        const addPrice = tag[1]
        setPrice(price + addPrice)
        setSelectedTags(temp)
    }

    //delete Tag from buffer
    const deleteTag = (tag: [string, number]) => {
        const temp = selectedTags.filter(tuple => !(tuple[0] == tag[0]))
        const minusPrise = tag[1]
        setPrice(price - minusPrise)
        setSelectedTags(temp)
    }

    const updateNote = (note: string) => {
        setNote(note)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize: 20}}>#{item.route.params.data.dish_id} {item.route.params.data.order_name}</Text>
            <TagsDemoAndNote tags={selectedTags} delete_tag={deleteTag} submit_note={updateNote}/>
            <ScrollView>
                <View>
                    {
                        orderDataSection.map((value, index) => {
                            return (
                                Object.keys(tagList).length ?
                                    <TagsList
                                        key={"Section" + index}
                                        sectionName={value}
                                        data={tagList[value]}
                                        selectedTags={selectedTags}
                                        deleteTag={deleteTag}
                                        addTag={addTag}
                                    /> :
                                    <ActivityIndicator size="large" color="#a0c4ff" style={{margin: 50}} key={"Section" + index}/>
                            )
                        })
                    }
                    <View style={{height: 50}}></View>
                </View>
            </ScrollView>
            <SubmitButton onPress={() => {
                const newOneOrder: OneOrderType = {
                    dish_id: item.route.params.data.dish_id,
                    order_name: item.route.params.data.order_name,
                    quantity: 1,
                    tags: selectedTags,
                    note: note,
                    price: price
                }
                context.selectedItems.price += price
                context.selectedItems.orders.push(newOneOrder)
                context.updateSelectedItems(context.selectedItems)
                item.navigation.navigate("DishSelection")
            }}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        padding: 10,
    },
    demoContainer: {
        padding: 16
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        padding: 9,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#333',
        fontWeight: "bold",
        fontSize: 14,
        textTransform: "capitalize"
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        borderRadius: 8,
    },
    scrollView: {}
})