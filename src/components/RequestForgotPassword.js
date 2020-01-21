import * as Yup from 'yup';
import {Formik} from 'formik';
import {Button, Container, Label} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withNavigation} from 'react-navigation';
import React, {Component, Fragment} from 'react';
import {TextInput, Text, Image, StyleSheet, View, Alert} from 'react-native';
import {API_KEY_URL} from 'react-native-dotenv';
import {connect} from 'react-redux';
import {forgot} from '../public/redux/actions/auth';

class RequestForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  sendEmail = values =>{
    this.props.forgot(API_KEY_URL + '/auth/forgot', {email: values.email})
    .then(result => {
      console.log(result);
      Alert.alert(
        'Kode OTP dikirim',
        'Cek email mu untuk melihat kode OTP',
        [
          {
            text: 'OK',
            onPress: () => console.log('Ok Pressed'),
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        },
      );
      this.props.navigation.navigate('ResetPassword');
    })
    .catch(err => {
      console.log(err);
      Alert.alert(
        'Opps!',
        this.props.auth.data.data.message === "Email not found" ? "Harap masukkan email yang terdaftar" : "Something happens" ,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        },
      );
    });
  }
  render() {
    return (
      <Formik
        initialValues={{email: ''}}
        onSubmit={values => this.sendEmail(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .label('email')
            .email('Enter a valid email')
            .required('Please enter a registered email'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          setFieldValue,
          handleSubmit,
        }) => (
          <Fragment>
            <ScrollView>
              <Container style={style.container}>
                <View style={style.logo}>
                  <Image
                    source={require('../assets/logo.png')}
                    style={style.image}
                  />
                </View>
                <View>
                  <Label style={style.label}>Request Password Baru</Label>
                  <Text style={style.textNew}>
                    Kami akan mengirim kode OTP untuk mereset password anda
                    melalu email yang teregistrasi
                  </Text>
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholder="E-mail"
                    onBlur={() => setFieldTouched('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={style.erremail}>{errors.email}</Text>
                  )}
                  <Button
                    full
                    title="Submit"
                    disabled={!isValid}
                    onPress={handleSubmit}
                    style={style.submit}>
                    <Text style={style.submitText}>Submit</Text>
                  </Button>
                  <Button
                    full
                    title="Sign In"
                    onPress={() => this.props.navigation.navigate('Login')}
                    style={style.signin}>
                    <Text style={style.signintext}>Sign In</Text>
                  </Button>
                </View>
              </Container>
            </ScrollView>
          </Fragment>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  forgot: (url, data) => dispatch(forgot(url, data)),
});

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(RequestForgotPassword),
);

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexGrow: 1,
    padding: wp('5%'),
  },
  textSignUp: {
    color: 'white',
    textAlign: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-20%'),
  },
  submit: {
    backgroundColor: '#ffffff',
    borderRadius: wp('3%'),
    borderWidth: wp('0.5%'),
    marginTop: hp('3%'),
    borderColor: '#03AC0E',
  },
  submitText: {
    color: '#03AC0E',
  },
  signintext: {
    color: '#ffffff',
  },
  signin: {
    backgroundColor: '#03AC0E',
    borderRadius: wp('3%'),
    marginTop: hp('3%'),
  },
  forgot: {textAlign: 'right', color: 'grey'},
  image: {resizeMode: 'stretch', width: wp('80%')},
  label: {fontSize: wp('5%'), textAlign: 'center'},
  errpass: {fontSize: wp('3%'), color: 'red'},
  erremail: {fontSize: wp('3%'), color: 'red'},
  errrole: {fontSize: wp('3%'), color: 'red'},
  textNew: {
    fontSize: wp('3%'),
    textAlign: 'center',
    marginTop: hp('3%'),
    color: 'rgba(0,0,0,0.6)',
  },
});
