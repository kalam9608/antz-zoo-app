import React from "react";
import { Text, View } from "react-native";
import { calculateAge } from "./Utils";
import { useSelector } from "react-redux";
import FontSize from "../configs/FontSize";

const AgeCalculation = ({ from, to }) => {
  const age = calculateAge(from, to);
  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  return (
    <>
      {age.years || age.months || age.days ? (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ justifyContent: "center" }}>
            {age.years ? (
              <Text
                style={{
                  fontSize: FontSize.Antz_Major_Medium.fontSize,
                  fontWeight: FontSize.Antz_Major_Medium.fontWeight,
                  color: constThemeColor.onSurfaceVariant,
                }}
              >
                {age.years}
              </Text>
            ) : null}{" "}
          </Text>

          {age.years || age.months ? (
            <View style={{ marginLeft: 1, justifyContent: "center" }}>
              {age.years ? (
                <Text
                  style={{
                    color: constThemeColor.onSurfaceVariant,
                    fontSize: FontSize.Antz_Body_Medium.fontSize,
                    fontWeight: FontSize.Antz_Body_Medium.fontWeight,
                  }}
                >
                  Years
                </Text>
              ) : null}
              {age.months ? (
                <Text>
                  {age.months ? (
                    <Text style={{ color: constThemeColor.outline }}>{age.months} month</Text>
                  ) : null}
                </Text>
              ) : null}
            </View>
          ) : age.years ? null : (
            <Text style={{}}>
              {age.days>1 ? <Text>{age.days} days</Text> : <Text>{age.days} day</Text>}
            </Text>
          )}
        </View>
      ) : age.days==0?(
        <Text style={{ fontSize: FontSize.Antz_Body_Medium.fontSize }}>New Born</Text>
      ):from==null&&(<Text style={{ fontSize: FontSize.Antz_Body_Medium.fontSize }}>NA</Text>)
      }
    </>
  );
};

export default AgeCalculation;
