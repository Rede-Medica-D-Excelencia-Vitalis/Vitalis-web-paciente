import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StarIcon } from 'lucide-react';

interface OrderReviewCardProps {
  orderId: string | number;
  onClose: () => void;
  onSubmit?: (rating: number, comment: string) => void;
}

export const OrderReviewCard: React.FC<OrderReviewCardProps> = ({ orderId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmit) onSubmit(rating, comment);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <Card className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative animate-fade-in">
        <CardHeader>
          <CardTitle>Avalie seu pedido #{orderId}</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-green-600 font-bold py-8">Avaliação enviada! Obrigado pelo feedback.</div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-8 h-8 cursor-pointer mx-1 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                    fill={star <= rating ? '#facc15' : 'none'}
                  />
                ))}
              </div>
              <textarea
                className="w-full border rounded p-2 mb-4 resize-none min-h-[70px]"
                placeholder="Deixe um comentário (opcional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit} disabled={rating === 0}>Enviar Avaliação</Button>
                <Button className="flex-1" variant="outline" onClick={onClose}>Cancelar</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
