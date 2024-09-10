import React, {useContext, useEffect, useState} from "react";
import {SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Alert} from "react-native";
import {AppContext} from "../Utils/AppContext";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {FullOrderType, OneOrderType} from "../Config/OrderType";
import {RouteProp} from "@react-navigation/native";
import {determineColor, tagsPalette} from "../Config/Palette";
import Icon from "react-native-vector-icons/MaterialIcons";

type TagListInput = {
    sectionName: string,
    data: [string, number][],
    selectedTags: [string, number][],
    deleteTag: (tag: [string, number]) => void,
    addTag: (tag: [string, number]) => void,
}

type TagInput = {
    tag: [string, number],
    selectedTag: [string, number][],
    deleteTag: (tag: [string, number]) => void,
    addTag: (tag: [string, number]) => void,
}

function Tag({tag, selectedTag, deleteTag, addTag}: TagInput): React.JSX.Element {
    const [opened, setOpened] = useState(false)
    useEffect(() => {
        const temp = selectedTag.some(tuple => tuple[0] == tag[0] && tuple[1] == tag[1])
        if (temp) {
            setOpened(true)
        } else {
            setOpened(false)
        }
    }, [selectedTag]);
    return (
        <TouchableOpacity
            style={{
                ...styles.tags,
                backgroundColor: opened ? "#7c7c7c" : tagsPalette[determineColor(tag[0], 5) % tagsPalette.length]
            }}
            onPress={() => {
                if (opened) {
                    deleteTag(tag)
                } else {
                    addTag(tag)
                }
            }}
        >
            <Text style={{
                fontSize: 17,
                textTransform: "capitalize",
                fontWeight: "bold"
            }}>{tag[0]}{opened ? <Icon name={'close'} size={15}/> : ''}</Text>
        </TouchableOpacity>
    )
}

export default function TagsList({
                                     sectionName,
                                     data,
                                     selectedTags,
                                     deleteTag,
                                     addTag
                                 }: TagListInput): React.JSX.Element {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{sectionName}</Text>
            </View>
            <View style={styles.seperator}></View>
            <View style={styles.tagContainer}>
                {
                    data.map((value, index) => {
                        return (
                            <Tag key={"Tag" + index}
                                 tag={value}
                                 selectedTag={selectedTags}
                                 deleteTag={deleteTag}
                                 addTag={addTag}/>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
    },
    titleContainer: {},
    title: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: "monospace",
        textTransform: "capitalize"
    },
    seperator: {
        width: "100%",
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        height: 0
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tags: {
        padding: 10,
        margin: 5,
        width: "auto",
        borderRadius: 15,
    }
})