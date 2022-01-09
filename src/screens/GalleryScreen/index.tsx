import React, {useEffect, useState, useRef} from 'react';
import {
  StatusBar,
  Text,
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Styled from 'styled-components/native';

import BackHeader from '@anibox/components/common/BackHeader';
import Gallery from '@anibox/components/gallery/Gallery';
import {width} from '@anibox/styles';
import {getImagesFromPixcels} from '@anibox/api/gallery';

const IMAGE_SIZE = 60;
const SPACING = 10;

const Container = Styled.View`
  flex: 1;
`;

const StyledFlatList = Styled.FlatList`
  position: absolute;
  bottom: 40px;
  padding: 0px ${SPACING}px;
`;

const GalleryScreen = () => {
  const [images, setImages] = useState(null);

  useEffect(() => {
    getImagesFromPixcels().then(items => {
      setImages(items);
    });
  }, []);

  const topRef = useRef();
  const thumbRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToActiveIndex = index => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  if (!images) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Container>
      {/* <StatusBar hidden /> */}
      <BackHeader absolute={true} />
      <FlatList
        ref={topRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width),
          );
        }}
        data={images}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => <Gallery uri={item?.src?.portrait} />}
      />
      <StyledFlatList
        ref={thumbRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{uri: item?.src?.portrait}}
                style={[
                  styles.image,
                  {
                    borderColor: activeIndex === index ? '#fff' : 'transparent',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    marginRight: SPACING,
    borderWidth: 2,
  },
});
export default GalleryScreen;
