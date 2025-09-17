import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FontsEnum} from "../../constants/FontsEnum";
import GlobalStyle from "../../constants/GlobalStyle";
import {StyledText} from '../StyledText';
import {RFValue} from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {IMLocalized} from "../../utils/Translater";
import Colors from "../../constants/Colors";
import {Icon} from "react-native-elements";

const SummaryItem = ({label, value, withIcon,  onIconPress = () => {}}) => (
    <View style={[GlobalStyle?.flexRow, styles.taxContainer]}>
        {withIcon ?
            <View style={GlobalStyle.flexRow}>
                <StyledText style={{marginLeft: 5}}>{label}</StyledText>
                <TouchableOpacity onPress={onIconPress}>
                    <Icon
                        size={18}
                        color={Colors.medium}
                        name={'info'}/>
                </TouchableOpacity>
            </View>
            :
            <StyledText style={{marginLeft: 5}}>{label}</StyledText>}
        <StyledText style={{marginRight: 5}}>{value} MRU</StyledText>
    </View>
);


const PaymentSummary = ({total, subTotal, serviceFees}) => (
        <View style={{backgroundColor: "#fff", margin: wp('0.6%')}}>
            <StyledText
                style={{color: "#262626", fontSize: RFValue(14), fontFamily: FontsEnum.Poppins_600SemiBold, marginLeft: 14}}>
                Payment summary
            </StyledText>

            <View style={[styles.priceContainer]}>
                <SummaryItem label={IMLocalized("Subtotal")} value={subTotal} withIcon={false}/>
                    <SummaryItem label={IMLocalized("Services fees")}
                                 value={serviceFees} withIcon={true}/>
                <View style={styles.separator}/>


                <View style={[GlobalStyle?.flexRow, styles.taxContainer, styles.totalContainer]}>
                    <StyledText style={[styles.total]}>
                        {IMLocalized("TOTAL")}
                    </StyledText>
                    <StyledText style={[styles.total, {marginRight: 10}]}>
                        {total}
                    </StyledText>
                </View>
            </View>
        </View>
    );

const styles = StyleSheet.create({
    taxContainer: {
        justifyContent: "space-between",
        marginVertical: 5,
    },
    total: {
        fontFamily: FontsEnum.Poppins_700Bold,
        fontSize: RFValue(16),
        marginLeft: wp('2%'),
    },
    totalContainer: {
        marginHorizontal: 0,
        marginVertical: 0,
        marginTop: 10,
        borderRadius: 0,
        paddingVertical: 7,
    },
    priceContainer: {
        width: "95%",
        overflow: "hidden",
        marginVertical: 10,
        marginHorizontal: 10
    },
    separator: {
        height: 3,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#DFDFDF",
    },
})
export default PaymentSummary;
