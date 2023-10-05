import { useAppSelector } from "@/hooks/useAppSelector";
import { selectDraftListing } from "@/redux/listings/draft/draftSlice";
import { TReset } from "@/types/react-hook-form";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Chip, HelperText, TextInput } from "react-native-paper";

type KeywordsProps = {
  resetForm: TReset;
};
const Keywords = ({ resetForm }: KeywordsProps) => {
  const draft = useAppSelector(selectDraftListing);

  const [keywords, setKeywords] = useState<string[]>(draft.keywords || []);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    resetForm({ keywords });
  }, [keywords]);

  return (
    <View>
      <TextInput
        //keyboardType="number-pad"
        dense
        mode="outlined"
        //dense//Sets min height with densed layout//adds paddingVertical
        placeholder="eg. New, furnished, hostel"
        //label="Enter keyword"
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
        right={
          <TextInput.Icon
            icon="plus"
            onPress={() => {
              keyword && setKeywords((prev) => [...prev, keyword]);
              setKeyword("");
            }}
          />
        }
      />
      <HelperText type="info" visible={true}>
        Enter a keyword and tap the + sign
      </HelperText>
      <View className="flex-row content-evenly flex-wrap gap-x-2 ">
        {keywords.map((kwd, i) => {
          return (
            <Chip
              closeIcon="close"
              onClose={() =>
                setKeywords(keywords.filter((word, index) => index !== i))
              }
              key={i}
              mode="flat" //'flat'(default) | 'outlined'
              //onPress={() => }
            >
              {kwd}
            </Chip>
          );
        })}
      </View>
    </View>
  );
};

export default Keywords;
