import React from 'react';
import { cn } from '../../lib/utils';

export type PaymentCardFieldFocus = 'number' | 'name' | 'expiry' | 'cvv' | null;

interface PaymentCardPreviewProps {
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
  focusedField?: PaymentCardFieldFocus;
  className?: string;
}

const getCardSegments = (rawNumber?: string) => {
  const digits = (rawNumber || '').replace(/\D/g, '').slice(0, 16);
  const segments = Array.from({ length: 4 }, (_, index) => {
    const start = index * 4;
    const chunk = digits.slice(start, start + 4);
    if (!chunk) {
      return '****';
    }
    return chunk.padEnd(4, '*');
  });
  return segments;
};

const formatName = (name?: string) => {
  if (!name?.trim()) {
    return 'NOME IMPRESSO';
  }
  return name.toUpperCase();
};

const formatExpiry = (expiry?: string) => {
  if (!expiry?.trim()) {
    return 'MM/AA';
  }
  const clean = expiry.replace(/\D/g, '').slice(0, 4);
  if (clean.length < 2) {
    return 'MM/AA';
  }
  const month = clean.slice(0, 2);
  const year = clean.slice(2);
  return year ? `${month}/${year}` : `${month}/AA`;
};

const detectBrand = (rawNumber?: string) => {
  const digits = (rawNumber || '').replace(/\s/g, '');

  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  if (/^3(?:0[0-5]|[68])/.test(digits)) return 'Diners';
  if (/^35[2-8]/.test(digits)) return 'JCB';

  return 'Cartão Vitalis';
};

export const PaymentCardPreview: React.FC<PaymentCardPreviewProps> = ({
  cardNumber,
  cardName,
  expiry,
  cvv,
  focusedField = null,
  className,
}) => {
  const isFlipped = focusedField === 'cvv';
  const cardSegments = getCardSegments(cardNumber);
  const cvvDigits = (cvv || '').replace(/\D/g, '').slice(0, 4);
  const cvvDisplay = cvvDigits ? cvvDigits.padEnd(3, '*') : '***';
  const brand = detectBrand(cardNumber);

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <div
        className="relative w-full max-w-sm h-56"
        style={{ perspective: '1200px' }}
      >
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]',
            isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]',
          )}
        >
          {/* Frente */}
          <div
            className={cn(
              'absolute inset-0 rounded-3xl p-6 shadow-2xl text-white',
              'bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500',
              'flex flex-col justify-between',
              '[backface-visibility:hidden]',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.3em] opacity-80">
                  Vitalis Card
                </span>
                <span className="text-sm font-semibold opacity-90">{brand}</span>
              </div>
              <img
                src="/logo-small-1.png"
                alt="Vitalis"
                className="h-10 w-auto drop-shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                {cardSegments.map((segment, index) => (
                  <span
                    key={`segment-${index}`}
                    className={cn(
                      'text-lg font-medium tracking-[0.25em] min-w-[4ch]',
                      focusedField === 'number' ? 'text-white' : 'text-white/90',
                    )}
                  >
                    {segment}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                <div className="flex flex-col">
                  <span className={focusedField === 'name' ? 'text-white' : 'text-white/70'}>
                    Titular
                  </span>
                  <span className="text-sm font-semibold">
                    {formatName(cardName)}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className={focusedField === 'expiry' ? 'text-white' : 'text-white/70'}>
                    Validade
                  </span>
                  <span className="text-sm font-semibold">
                    {formatExpiry(expiry)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verso */}
          <div
            className={cn(
              'absolute inset-0 rounded-3xl p-6 shadow-2xl text-white',
              'bg-gradient-to-br from-slate-800 to-slate-900',
              'flex flex-col justify-between',
              '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            )}
          >
            <div className="h-10 bg-black/80 rounded-md mt-2"></div>

            <div className="bg-white rounded-md px-4 py-2 text-right">
              <span className="text-xs font-semibold text-slate-500">CVV</span>
              <p className="text-lg tracking-[0.4em] text-slate-900">
                {cvvDisplay}
              </p>
            </div>

            <div className="text-xs text-white/60">
              Segurança garantida pela Vitalis - Pagamento criptografado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

