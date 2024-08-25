import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';

export const AssessmentTable = () => {
  const [data, setData] = useState([])
  const [slideIn, setSlideIn] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const innerFlatListRefs = useRef({});

  useEffect(()=>{
    const newObject = {
      title: 'title',
      details: [
        {
          _id: 0,
          short: 'short',
          type: 'type',
          color: 'color',
          size: 'size',
          price: 'price',
        },
      ],
    };
    const newData = [{ ...newObject }, ...sideData_];
    setData(newData)
  },[])

  const getItemLayout = (data, index) => ({
    length: 66,
    offset: 66 * index,
    index,
  });

  const renderItem = (parentItem, index) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          key={index}
          style={[styles.boxContainer, {width: slideIn ? 50 : 100}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{parentItem?.title}</Text>
            {index === 0 && parentItem?.title === 'title' ? (
              <TouchableOpacity
                onPress={() => setSlideIn(!slideIn)}
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: '#000',
                  borderRadius: 15,
                  marginLeft: 5,
                }}
              />
            ) : null}
          </View>
        </View>
        <View>
          <FlatList
            ref={ref => (innerFlatListRefs.current[index] = ref)}
            data={parentItem?.details}
            horizontal={true}
            bounces={false}
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingRight: 100}}
            keyExtractor={(_, index) => index.toString()}
            //getItemLayout={getItemLayout}
            onScroll={event => onInnerFlatListScroll(event, index)}
            renderItem={({item}) => (
              <>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: '#FFF',
                    width: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>{item?.short}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: '#FFF',
                    width: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>{item?.type}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFF',
                    width: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>{item?.color}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFF',
                    width: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>{item?.size}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFF',
                    width: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>{item?.price}</Text>
                </View>
              </>
            )}
          />
        </View>
      </View>
    );
  };

  const onInnerFlatListScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const innerFlatListKeys = Object.keys(innerFlatListRefs.current);
  
    innerFlatListKeys.forEach(key => {
      const ref = innerFlatListRefs.current[key];

        ref.scrollToOffset({ offset: xOffset, animated: false });
      
    });
  };


  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'blue',
          flex: 1,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => renderItem(item, index)}
          stickyHeaderIndices={[0]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    width: 300,
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const sideData_ = [

  {
    title: 'Apple',
    details: [
      {
        _id: 1,
        short: 'A',
        type: 'Fruits',
        color: 'Red',
        size: '5 x 5',
        price: '$2',
      },
    ],
  },
  {
    title: 'Banana',
    details: [
      {
        _id: 2,
        short: 'B',
        type: 'Fruits',
        color: 'Yellow',
        size: '6 x 2',
        price: '$1',
      },
    ],
  },
  {
    title: 'Orange',
    details: [
      {
        _id: 3,
        short: 'O',
        type: 'Fruits',
        color: 'Orange',
        size: '4 x 4',
        price: '$3',
      },
    ],
  },
  {
    title: 'Grapes',
    details: [
      {
        _id: 4,
        short: 'G',
        type: 'Fruits',
        color: 'Purple',
        size: 'Varies',
        price: '$4',
      },
    ],
  },
  {
    title: 'Strawberry',
    details: [
      {
        _id: 5,
        short: 'S',
        type: 'Fruits',
        color: 'Red',
        size: '1 x 1',
        price: '$5',
      },
    ],
  },
  {
    title: 'Pineapple',
    details: [
      {
        _id: 6,
        short: 'P',
        type: 'Fruits',
        color: 'Yellow',
        size: '7 x 7',
        price: '$6',
      },
    ],
  },
  {
    title: 'Mango',
    details: [
      {
        _id: 7,
        short: 'M',
        type: 'Fruits',
        color: 'Yellow',
        size: '6 x 6',
        price: '$3',
      },
    ],
  },
  {
    title: 'Pineapple',
    details: [
      {
        _id: 8,
        short: 'P',
        type: 'Fruits',
        color: 'Yellow',
        size: '7 x 7',
        price: '$6',
      },
    ],
  },
  {
    title: 'Mango',
    details: [
      {
        _id: 9,
        short: 'M',
        type: 'Fruits',
        color: 'Yellow',
        size: '6 x 6',
        price: '$3',
      },
    ],
  },
];
