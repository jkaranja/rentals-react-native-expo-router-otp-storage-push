import { useAppSelector } from "@/hooks/useAppSelector";
import { selectDraftListing } from "@/redux/listings/draft/draftSlice";
import { TReset } from "@/types/react-hook-form";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Chip, HelperText, TextInput } from "react-native-paper";

type PoliciesProps = {
  resetForm: TReset;
};
const Policies = ({ resetForm }: PoliciesProps) => {
  const draft = useAppSelector(selectDraftListing);

  const [policies, setPolicies] = useState<string[]>(draft.policies || []);

  const [policy, setPolicy] = useState("");

  useEffect(() => {
    resetForm({ policies });
  }, [policies]);

  return (
    <View>
      <TextInput
        //keyboardType="number-pad"
        dense
        mode="outlined"
        //dense//Sets min height with densed layout//adds paddingVertical
        placeholder="eg. No smoking"
        //label="Enter policy"
        value={policy}
        onChangeText={(text) => setPolicy(text)}
        right={
          <TextInput.Icon
            icon="plus"
            onPress={() => {
              policy && setPolicies((prev) => [...prev, policy]);
              setPolicy("");
            }}
          />
        }
      />
      <HelperText type="info" visible={true}>
        Enter a policy and tap the + sign
      </HelperText>
      <View className="flex-col content-evenly flex-wrap justify-evenly">
        {policies.map((pol, i) => {
          return (
            <View key={i}>
              <Chip
                className="mt-1"
                closeIcon="close"
                onClose={() =>
                  setPolicies(policies.filter((value) => value !== pol))
                }
                key={i}
                mode="flat" //'flat'(default) | 'outlined'
                //onPress={() => }
              >
                {pol}
              </Chip>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Policies;
