import React from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { Controller, useFieldArray, useForm } from "react-hook-form";

type PoliciesProps = {
  policies: string[];
  setPolicies: React.Dispatch<React.SetStateAction<string[]>>;
};
const Policies = ({ policies, setPolicies }: PoliciesProps) => {
  type FormValues = {
    policies: Array<{ policy: string }>;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      policies: [
        {
          policy: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "policies", // unique name for your Field Array
  });

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <View>
      <View className="flex-row justify-end items-start">
        <Button
          // compact
          mode="contained"
          icon="plus"
          onPress={() =>
            append({
              policy: "",
            })
          }
        >
          Add
        </Button>
      </View>

      {fields.map((item: any, index: number) => (
        <View key={item.id} className="flex-row items-center gap-x-1">
          <Text>{`${index + 1}`}.</Text>
          <Controller
            name={`policies.${index}.policy`}
            control={control}
            rules={
              {
                //required: " Policy is required",
              }
            }
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="grow"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                //dense//Sets min height with densed layout//adds paddingVertical
                //multiline={true} //boolean//whether the input can have multiple lines.
                //numberOfLines={2}
                //left={<TextInput.Affix text={`${index}`} />}
              />
            )}
          />
          <Button
            mode="contained"
            icon="minus"
            onPress={() => remove(index)}
            className="bg-red"
          >
            {}
          </Button>
        </View>
      ))}

      <Button onPress={handleSubmit(onSubmit)}> </Button>
    </View>
  );
};

export default Policies;
