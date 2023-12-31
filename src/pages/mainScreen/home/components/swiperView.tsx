import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Dimensions, LogBox, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Text } from 'react-native-paper';
import { FC, PropsWithChildren } from 'react';
// export const ImageItems = [
//   require('@assets/imgs/demo/carousel-0.jpg'),
//   require('@assets/imgs/demo/carousel-1.jpg'),
//   require('@assets/imgs/demo/carousel-2.jpg'),
// ];
const PAGE_WIDTH = Dimensions.get('window').width;
export interface ISButtonProps {
  visible?: boolean
  onPress?: () => void
}

export interface IProps {
  swiperList: {
    pictureFile: any[]
  }[]
}



function Index({ swiperList }: IProps) {
  const pressAnim = useSharedValue<number>(0);
  const progressValue = useSharedValue<number>(0);

  const ImageItems = swiperList.map(item => item.pictureFile);

  const animationStyle = React.useCallback(
    (value: number) => {
      'worklet';

      const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
      const translateX = interpolate(
        value,
        [-1, 0, 1],
        [-PAGE_WIDTH, 0, PAGE_WIDTH],
      );

      return {
        transform: [{ translateX }],
        zIndex,
      };
    },
    [],
  );

  React.useEffect(() => {
    console.log(pressAnim.value);

  }, [pressAnim.value]);

  return (
    <View className="flex-auto p-5  relative">
      <Carousel
        loop={true}
        autoPlay={true}
        pagingEnabled={true}
        className="h-full"
        style={{ width: PAGE_WIDTH - 40 }}
        width={PAGE_WIDTH - 40}
        data={[...ImageItems]}
        //并且当数据长度小于 3 时，您还需要添加 prop
        // autoFillData={false}
        // onSnapToItem={(index) => console.log('current index:', index)}
        onScrollBegin={() => {
          pressAnim.value = withTiming(1);
        }}
        onScrollEnd={() => {
          pressAnim.value = withTiming(0);
        }}
        onProgressChange={(offsetProgress, absoluteProgress) => {



          progressValue.value = absoluteProgress;
        }}
        renderItem={({ index, item }) => {
          return (
            <CustomItem
              source={item}
              key={index}
              pressAnim={pressAnim}
            />
          );
        }}
        customAnimation={animationStyle}
        scrollAnimationDuration={3000}

      />

      <View className="flex-row absolute bottom-10 left-0 right-0 justify-center items-center">
        {ImageItems.map((item, index) => (
          <PaginationItem animValue={progressValue} length={ImageItems.length}
            index={index}
            key={index} />
        ))}
      </View>
    </View>
  );
}

interface ItemProps {
  pressAnim: Animated.SharedValue<number>
  source: ImageSourcePropType
}

const CustomItem: React.FC<ItemProps> = ({ pressAnim, source }) => {
  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressAnim.value, [0, 1], [1, 0.9]);
    const borderRadius = interpolate(pressAnim.value, [0, 1], [0, 30]);

    return {
      transform: [{ scale }],
      borderRadius,
    };
  }, []);

  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, animStyle]}>
      <Animated.Image
        source={{ uri: source }}
        style={{ width: '100%', height: '100%' }}
      />

    </Animated.View>
  );
};


const PaginationItem: React.FC<{
  index: number
  length: number
  animValue: Animated.SharedValue<number>
  isRotate?: boolean
}> = (props) => {
  const { animValue, index, length, isRotate } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }
    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      className="w-2.5 h-2.5 rounded-xl overflow-hidden bg-[#ffffff19] mx-1"
      style={{
        transform: [
          {
            rotateZ: isRotate ? '90deg' : '0deg',
          },
        ],
      }}
    >
      <Animated.View
        className={'w-2.5 h-2.5 bg-white  rounded'}

        style={[
          animStyle,
        ]}
      />
    </View>
  );
};

export default Index;
