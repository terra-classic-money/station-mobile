import React, { ReactElement, useRef } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native'

import { useApp } from 'hooks'
import color from 'styles/color'
import Text from './Text'

const SelectItemList = <T,>({
  list,
  onSelect,
  drawer,
  selectedValue,
  compareKey,
  flatListRef,
}: { drawer: Drawer } & SelectorProps<T>): ReactElement => {
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        scrollEnabled={list.length > 6}
        getItemLayout={(
          data,
          index
        ): {
          length: number
          offset: number
          index: number
        } => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
        onLayout={(): void => {
          if (selectedValue && flatListRef.current) {
            const index = list.findIndex((x) =>
              compareKey
                ? selectedValue[compareKey] === x.value[compareKey]
                : selectedValue === x.value
            )
            flatListRef.current.scrollToIndex({
              animated: true,
              index,
            })
          }
        }}
        data={list}
        keyExtractor={(item, index): string => `items-${index}`}
        renderItem={({ item, index }): ReactElement => {
          return (
            <TouchableOpacity
              onPress={(): void => {
                onSelect(item.value)
                drawer.close()
              }}
              style={[
                styles.item,
                index === 0
                  ? { marginTop: -18 }
                  : index === list.length - 1
                  ? {
                      marginBottom: -18,
                      borderTopWidth: 1,
                      borderTopColor: '#edf1f7',
                    }
                  : {
                      borderTopWidth: 1,
                      borderTopColor: '#edf1f7',
                    },
              ]}
            >
              <Text style={styles.label} fontType={'medium'}>
                {item.label}
              </Text>
              <View
                style={{
                  backgroundColor: '#d2daf0',
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {(compareKey
                  ? selectedValue[compareKey] ===
                    item.value[compareKey]
                  : selectedValue === item.value) && (
                  <View
                    style={{
                      backgroundColor: color.sapphire,
                      width: 12,
                      height: 12,
                      borderRadius: 100,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

type SelectorProps<T> = {
  containerStyle?: StyleProp<ViewStyle>
  display: string | ReactElement
  selectedValue: T
  list: {
    label: string
    value: T
  }[]
  onSelect: (value: T) => void
  compareKey?: keyof T
  flatListRef: React.RefObject<FlatList<any>>
}

const Selector = <T,>(props: SelectorProps<T>): ReactElement => {
  const { drawer } = useApp()
  const flatListRef = useRef<FlatList>(null)

  const onPress = (): void => {
    drawer.open(SelectItemList({ ...props, drawer, flatListRef }))
  }
  return (
    <TouchableOpacity style={props.containerStyle} onPress={onPress}>
      {typeof props.display === 'string' ? (
        <Text>{props.display}</Text>
      ) : (
        props.display
      )}
    </TouchableOpacity>
  )
}

export default Selector

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderRadius: 18,
    paddingVertical: 18,
    marginTop: 20,
    maxHeight: 400,
  },
  item: {
    paddingHorizontal: 30,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
})
