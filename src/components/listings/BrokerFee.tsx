import { TControl, TRegister } from "@/types/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

type BrokerFeeProps = {
  control: TControl;
};

const BrokerFee = ({ control }: BrokerFeeProps) => {
  return (
    <View>
      <Controller
        name="brokerFee"
        control={control}
        rules={{
         // required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Ksh"
            keyboardType="number-pad"
            dense
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            //left={<TextInput.Affix text="Ksh" />}
            // error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
          />
        )}
      />
    </View>
  );
};

export default BrokerFee;
