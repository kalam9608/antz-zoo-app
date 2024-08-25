import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDesignation } from "../../services/staffManagement/getEducationType";
import Loader from "../../components/Loader";
import FloatingButton from "../../components/FloatingButton";
import FontSize from "../../configs/FontSize";


const Designation = () => {
    const navigation = useNavigation();
    const [designationData, setDesignationData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        const unsubscribe=navigation.addListener('focus', () => {
            getLoaderData();
        });
        return unsubscribe;
    }, [navigation])

  const getLoaderData=()=>{
    setRefreshing(true)
    setIsLoading(true)
    getDesignation().then((res) => {
        setDesignationData(res);
        setIsLoading(false)
    }).finally(() => {
        setRefreshing(false)
        setIsLoading(false)
    })
  }

    const handelId = (id) => {
        navigation.navigate("DesignationDetail", { itemId: id })
    }

    const renderItem = (item) => {
        const { designation_id, status, designation_name, designation_code, created_at } = item;
        return (
            <TouchableOpacity onPress={() => handelId(designation_id)} style={[styles.listContainer, styles.shadow]}>
                <View style={styles.header}>
                    <View style={styles.innerHeader}>
                        <Text>ID : </Text>
                        <Text style={styles.idNumber}>{`#${designation_id}`}</Text>
                    </View>
                    <Text style={styles.idNumber}>{status}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Name :</Text>
                    <Text style={styles.idNumber}>{designation_name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Code :</Text>
                    <Text style={styles.idNumber}>{designation_code}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Created at : </Text>
                    <Text style={styles.idNumber}>{created_at}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            {
                isLoading || refreshing ? <Loader /> :

                    <View style={styles.container}>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Designation</Text>
                        </View>
                        <View style={styles.listSection}>
                            <FlatList
                                data={designationData}
                                renderItem={({ item }) => renderItem(item)}
                                keyExtractor={designationData.id}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getLoaderData} />}
                            />
                            <FloatingButton
                               icon="plus-circle-outline"
                                backgroundColor="#eeeeee"
                                borderWidth={0}
                                borderColor="#aaaaaa"
                                borderRadius={50}
                                linkTo=""
                                floaterStyle={{ height: 60, width: 60 }}
                                onPress={() => navigation.navigate("CreateDesignation")}
                            />
                        </View>
                    </View>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
        paddingTop: 12
    },
    titleSection: {
        marginTop: 14,
        alignSelf: 'center'
    },
    title: {
        fontSize: FontSize.Antz_Minor_Medium_title.fontSize,
        fontWeight: FontSize.Antz_Minor_Medium_title.fontWeight,
        paddingVertical: 10,
        color: '#000',
        lineHeight: 22
    },
    listSection: {
        // backgroundColor:'#ffe',
        flex: 1,
        marginTop: 15
    },
    listContainer: {
        backgroundColor: '#ccc',
        marginVertical: 5,
        borderRadius: 8,
        padding: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    innerHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    idNumber: {
        marginLeft: 5,
        fontWeight: FontSize.weight500
    },
    shadow: {
        shadowOffset: {
            height: 10,
            width: 5
        },
        shadowColor: 'rgba(0,0,0,1)',
        shadowOpacity: 1,
        // backgroundColor:'rgba(0,0,0,0.2)'
    }
})

export default Designation;