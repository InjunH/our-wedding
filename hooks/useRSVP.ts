
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RSVPFormData, RSVPStatus } from '../types';

export const useRSVP = () => {
  const [status, setStatus] = useState<RSVPStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitRSVP = async (data: RSVPFormData) => {
    setStatus('submitting');
    setError(null);

    try {
      await addDoc(collection(db, 'rsvp'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
    } catch (err) {
      console.error('RSVP 제출 오류:', err);
      setError('참석 여부 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
  };

  return { status, error, submitRSVP, reset };
};
