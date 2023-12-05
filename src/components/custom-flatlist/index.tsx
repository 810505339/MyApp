import { useRequest } from 'ahooks';
import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, Text, View, RefreshControlProps, Image } from 'react-native';
import { useImmer } from 'use-immer';
import { ActivityIndicator } from 'react-native-paper';




const noData = require('@assets/imgs/base/noData.png');

interface IPaginatedFlatListProps<T> {
  renderItem: (item: T, index: number) => React.ReactNode;
  data?: T[];
  onFetchData: (page: number) => Promise<T[]>;
  initialPage?: number;
  size?: number;
  refreshControlProps?: RefreshControlProps;
  errorComponent?: React.ReactNode;
  noDataComponent?: React.ReactNode;
  renderHeader?: React.ReactNode;
  noMoreData?: React.ReactNode
  params?: any
}

const INIT_STATE = {
  isLoading: false,
  isRefreshing: false,
  hasMoreData: true,
  error: null,
};



const RenderNoData = () => {
  return <View className="mt-40  justify-center items-center" >
    <Image source={noData} resizeMode="contain" />
    <Text className="mt-2 opacity-50 text-xs font-bold">没有数据</Text>
  </View>;
};

function CustomFlatList<T>({
  renderItem,
  data = [],
  onFetchData,
  initialPage = 1,
  size = 1,
  params,
  refreshControlProps,
  errorComponent = <Text>Oops! Something went wrong.</Text>,
  noMoreData = <Text>暂无更多数据</Text>,
  noDataComponent = <RenderNoData />,
  renderHeader = <></>,
}: IPaginatedFlatListProps<T>) {


  const [allData, setAllData] = useImmer({
    current: initialPage,
    ...INIT_STATE,
    data,
  });

  const { current, isLoading, isRefreshing, hasMoreData, error } = allData;

  const { run, runAsync } = useRequest(onFetchData, {
    manual: true,
    onSuccess(res) {
      const total = res?.data?.total ?? 0;
      setAllData((draft) => {
        draft.data = isRefreshing ? [...res?.data?.records ?? []] : [...draft?.data, ...res?.data?.records ?? []];
        draft.hasMoreData = total > draft.data.length;
      });
    },
    onBefore() {
      //请求之前 loading
      setAllData((draft) => {
        draft.isLoading = true;
      });
    },
    onFinally() {
      //请求结束
      setAllData((draft) => {
        draft.isLoading = false;
        draft.isRefreshing = false;

      });
    },
  });

  // 当 current 发生变化时，重新获取数据
  useEffect(() => {
    run({ ...params, current, size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 上拉请求分页
  const fetchData = async () => {
    if (!hasMoreData || isLoading) {
      return;
    }
    await runAsync({ ...params, current: current + 1, size });
  };

  // 下拉刷新
  const refreshData = async () => {
    setAllData((draft) => {
      draft.isRefreshing = true;
      draft.hasMoreData = true;
    });
    await runAsync({ ...params, current: 1, size });
  };

  // 渲染每个 item
  const renderItemWithIndex = ({ item, index }: { item: T; index: number }) => renderItem(item, index);

  // 渲染 FlatList
  return (
    <FlatList
      data={allData.data}
      refreshing={isLoading}
      ListHeaderComponent={renderHeader}
      renderItem={({ item, index }) => renderItemWithIndex({ item, index })}
      keyExtractor={(item) => item.id}
      refreshControl={
        < RefreshControl refreshing={isRefreshing} onRefresh={refreshData} {...refreshControlProps} />
      }
      onEndReachedThreshold={0.1}
      onEndReached={fetchData}
      ListFooterComponent={
        isLoading ? (
          <ActivityIndicator />
        ) : (
          !hasMoreData && (
            <View>
              {!allData.data.length ? noDataComponent : noMoreData}
              {error ? errorComponent : null}
            </View>
          )
        )
      }
    />);
}


export default CustomFlatList;
