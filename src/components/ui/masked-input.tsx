
import React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface MaskedInputProps extends React.ComponentProps<"input"> {
  mask: 'whatsapp' | 'cpf' | 'cnpj' | 'currency' | 'date';
  value: string;
  onChange: (value: string) => void;
}

const masks = {
  whatsapp: {
    pattern: '(##) #####-####',
    maxLength: 15
  },
  cpf: {
    pattern: '###.###.###-##',
    maxLength: 14
  },
  cnpj: {
    pattern: '##.###.###/####-##',
    maxLength: 18
  },
  currency: {
    pattern: 'R$ #,##',
    maxLength: 20
  },
  date: {
    pattern: '##/##/####',
    maxLength: 10
  }
};

const applyMask = (value: string, mask: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '#') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }

  return maskedValue;
};

const applyCurrencyMask = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const numberValue = parseFloat(cleanValue) / 100;
  
  if (isNaN(numberValue)) return 'R$ 0,00';
  
  return numberValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value, onChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      let maskedValue = '';

      if (mask === 'currency') {
        maskedValue = applyCurrencyMask(inputValue);
      } else {
        const maskPattern = masks[mask].pattern;
        maskedValue = applyMask(inputValue, maskPattern);
      }

      onChange(maskedValue);
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        maxLength={masks[mask].maxLength}
        className={cn(className)}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";
