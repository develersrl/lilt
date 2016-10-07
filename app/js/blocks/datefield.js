'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import DatePicker from 'react-native-datepicker';

import { common, blocks } from '../style';
const { form } = common;


export default class DateField extends Component {
  render() {
    const {
      label,
      placeholder,
      date,
      onChangeDate,
      style,
      mandatory,
    } = this.props;

    // When placeholder prop is not defined we could use the empty string
    // as placeholder text. However, the empty string triggers a side-effect:
    // the date picker field is automatically filled with today's date.
    // For this reason we use a blank space (' ') as default placeholder.
    const _placeholder = placeholder ? placeholder : ' ';

    const _date = date ? date : '';
    const _onChangeDate = onChangeDate ? onChangeDate : null;

    let asterisk = null;
    if (mandatory)
      asterisk = (<Text style={[myStyle.label, myStyle.asterisk]}>*</Text>);

    return (
      <View style={[myStyle.container, style]}>
        <View style={myStyle.labelView}>
          <Text>
            <Text style={myStyle.label}>{label}</Text>
            {asterisk}
          </Text>
        </View>
        <DatePicker style={myStyle.picker}
                    mode={'date'}
                    date={_date}
                    placeholder={_placeholder}
                    format={'DD-MM-YYYY'}
                    minDate={'01-01-1900'}
                    maxDate={'31-12-2099'}
                    confirmBtnText={'OK'}
                    cancelBtnText={'Annulla'}
                    showIcon={false}
                    customStyles={{
                      dateInput: myStyle.dateInput,
                      dateTouchBody: myStyle.dateTouchBody,
                    }}
                    onDateChange={_onChangeDate}
                    />
      </View>
      );
  }
}


DateField.propTypes = {
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  date: React.PropTypes.string,
  onChangeDate: React.PropTypes.func,
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  mandatory: React.PropTypes.bool,
};


const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: form.fieldHeight,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    flexDirection: 'row',
  },
  labelView: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: '#BBBBBB',
  },
  label: {
    color: '#7B7A7A',
    fontWeight: 'bold',
  },
  asterisk: {
    color: blocks.tabbar.barColor,
  },
  picker: {
    flex: 1,
    height: form.fieldHeight,
  },
  dateInput: {
    borderWidth: 0,
  },
  dateTouchBody: {
    height: form.fieldHeight,
  },
});
