import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button, RadioButton, TextInput } from "react-native-paper";
import Slider from "@react-native-community/slider";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const PriceRange = () => {
  const [value, setValue] = React.useState("");
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100]);

  const multiSliderValuesChange = (values: Array<number>) =>
    setMultiSliderValue(values);

  return (
    <View>
      <View className="flex-row gap-3 flex-wrap content-evenly items-center">
        <TextInput
          mode="outlined"
          keyboardType="number-pad"
          //mode='flat' | 'outlined'//default: flat input with an underline.
          //outlineColor//Inactive outline color of the input.
          //activeOutlineColor//active outline color of the input.
          //underlineColor
          //activeUnderlineColor
          //textColor //Color of the text in the input.
          //dense//Sets min height with densed layout//adds paddingVertical
          //multiline=boolean//whether the input can have multiple lines.
          //numberOfLines={numberOfLines}
          //onFocus//Callback that is called when the text input is focused.
          //onBlur//Callback that is called when the text input is blurred.
          //render=()=> React.ReactNode//render custom input like nativeTextInput
          //left=React.ReactNode//same options as for right below or pass custom
          //right=React.ReactNode eg {<TextInput.Affix textStyle text="/100" />}//render a leading / trailing text in the TextInput
          //or an icon {<TextInput.Icon color onPress icon="eye" />}// render a leading / trailing icon in the TextInput
          //disabled
          dense
          placeholder="0"
          //error={false}//Whether to style the TextInput with error style.
          //label="Username"
          value={multiSliderValue[0].toString()}
          onChangeText={(text) =>
            setMultiSliderValue((prev) => [parseInt(text), prev[1]])
          }
          // secureTextEntry
          //contentStyle//Pass custom style directly to the input itself.
          //outlineStyle//override the default style of outlined wrapper eg borderRadius, borderColor
          //underlineStyle// override the default style of underlined wrapper// eg borderRadius
          //style={{}}//eg height of input /fontSize of text inside TextInput

          left={<TextInput.Affix text="Ksh" />}
        />

        <Text>To</Text>
        <TextInput
          keyboardType="number-pad"
          dense
          mode="outlined"
          //dense//Sets min height with densed layout//adds paddingVertical
          placeholder="0"
          // label="Username"
          value={multiSliderValue[1].toString()}
          onChangeText={(text) =>
            setMultiSliderValue((prev) => [prev[0], parseInt(text)])
          }
          left={<TextInput.Affix text="Ksh" />}
        />
      </View>
      {/** <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0} //Initial minimum value of the slider.Default value is 0.
        maximumValue={1} //Initial maximum value of the slider.Default value is 1.
        //minimumTrackTintColor="#FFFFFF" //The color used for the track to the left of the button.
        //maximumTrackTintColor="#000000" //The color used for the track to the right of the button.
        //disabled
        //lowerLimit={}//Slide lower limit.//won't be able to slide below this limit
        //upperLimit//won't be able to slide above this limit
        //onSlidingStart//Callback that is called when the user picks up the slider.//The initial value is passed as an argument to the callback handler.
        //onSlidingComplete//Callback that is called when the user releases the slider, regardless if the value has changed. The current value is passed as an argument to the callback handler.
        //onValueChange//Callback continuously called while the user is dragging the slider
        //step//Step value of the slider. The value should be between 0 and (maximumValue - minimumValue). default 0
        //value//Write-only property representing the value of the slider. Can be used to programmatically control the position of the thumb. Entered once at the beginning still acts as an initial value. Changing the value programmatically does not trigger any event.
        //tapToSeek//Defaults//Permits tapping on the slider//No effect on Android
        //inverted//Reverses the direction of the slider.
        //thumbTintColor//Color of the foreground switch grip.
        //vertical//Changes the orientation of the slider to vertical, if set to true.
      /> */}

      <MultiSlider
        values={[multiSliderValue[0], multiSliderValue[1]]} //Prefixed values of the slider.
        sliderLength={280} //Length of the slider//default: 280
        onValuesChange={multiSliderValuesChange} //Callback when the value changes
        //onValuesChangeStart//Callback when the value starts changing
        //onValuesChangeFinish//Callback when the value stops changing
        //touchDimensions//{height: 50,width: 50,borderRadius: 15,slipDisplacement: 200}
        touchDimensions={{
          height: 40,
          width: 40,
          borderRadius: 20,
          slipDisplacement: 40,
        }}
        //enableLabel//function
        min={0} //Minimum value available in the slider
        max={100} //Maximum value available in the slider
        //step={1}//default: 1//Step value of the slider.
        //vertical//false//Use vertical orientation instead of horizontal
        //stepsAs//when you want to customize the steps-labels//[{index: number, stepLabel: string, prefix: string, suffix: string}].
        //showSteps//false/Show steps
        //showStepMarkers//true//Show steps-markers on the track, showSteps has to be enabled as well
        //showStepLabels//true//Show steps-labels underneath the track, showSteps has to be enabled as well
        //snapped//Use this when you want a fixed position for your markers, this will split the slider in N specific positions
        //smoothSnapped//false//Same as snapped but you can move the slider as usual. When released it will go to the nearest marker
        allowOverlap={false} //Allow the overlap within the cursors.
        minMarkerOverlapDistance={10} //determine the closest two markers can come to each other
        selectedStyle={{
          backgroundColor: "#1792E8", //Styles for selected range track
        }}
        trackStyle={{
          //can use this to change track height the use markerOffsetX/Y to position marker
          backgroundColor: "#CECECE", //Styles for the range track//overridden by un/selected style
        }}
        pressedMarkerStyle={{
          height: 30,
          width: 30,
          borderRadius: 20,
          backgroundColor: "#148ADC",
        }}
        markerStyle={{}} //Styles for markers
        markerContainerStyle={{}} //Styles for markerContainer
        unselectedStyle={{}} //Styles for unselected track
        containerStyle={{}} //Styles for the slider container
        //markerOffsetX={0}//Offset the cursor(s) on the X axis
        //markerOffsetY={0}//Offset the cursor(s) on the Y axis
        //markerSize={0}//It determines the marker margin from the edges of the track, useful to avoid the markers to overflow out of the track.
      />
    </View>
  );
};

export default PriceRange;
