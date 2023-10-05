import { View, Text } from 'react-native'
import React from 'react'
import { DataTable } from 'react-native-paper';

const Earnings = () => {
  return (
    <View>
      <View>
        <DataTable.Header>
          <DataTable.Title sortDirection="descending">Dessert</DataTable.Title>
          <DataTable.Title numeric>Calories</DataTable.Title>
          <DataTable.Title numeric>Fat (g)</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell className="font-semibold">working</DataTable.Cell>
          <DataTable.Cell>working</DataTable.Cell>
        </DataTable.Row>
      </View>
    </View>
  );
}

export default Earnings