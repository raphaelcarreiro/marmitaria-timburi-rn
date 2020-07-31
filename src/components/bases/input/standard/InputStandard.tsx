import React, { useState, useCallback, ReactElement, useEffect, forwardRef } from 'react';
import { Input as StyledInput, Container, IconContainer, HelperText, InputContainer, TextLabel } from './styles';
import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  fullWidth?: boolean;
  Icon?: ReactElement;
  error?: boolean;
  required?: boolean;
  helperText?: string;
  label?: string;
}

interface InputRef {
  focus(): void;
}

const InputStandard: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { fullWidth, value, placeholder, required, Icon, error, helperText, label, ...rest },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderFocused, setPlaceholderFocused] = useState<string | undefined>('');

  useEffect(() => {
    let text;
    text = label || placeholder;
    text = required ? `${text} *` : text;
    setPlaceholderFocused(text);
  }, [label, placeholder, required]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container>
      {isFocused && label && <TextLabel>{label}</TextLabel>}
      <InputContainer fullWidth={fullWidth} isFocused={isFocused} error={error} helperText={!!helperText}>
        <StyledInput
          ref={ref}
          value={value}
          placeholder={isFocused ? placeholder : placeholderFocused}
          {...rest}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {Icon && <IconContainer>{Icon}</IconContainer>}
      </InputContainer>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </Container>
  );
};

export default forwardRef(InputStandard);