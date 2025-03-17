import React, { useState } from 'react';
import { TextInput, Text, View } from 'react-native';

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[{1,3}\.{1,3}\.{1,3}\.{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValid(validateEmail(text));
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Enter your email"
      />
      {!isValid && <Text style={{ color: 'red' }}>Invalid email format</Text>}
    </View>
  );
};

export default EmailInput;