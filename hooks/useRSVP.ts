
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RSVPFormData, RSVPStatus } from '../types';

const STORAGE_KEY = 'wedding_rsvp_submitted';

export const useRSVP = () => {
  const [status, setStatus] = useState<RSVPStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<RSVPFormData | null>(null);

  // 로컬 스토리지에서 이전 제출 데이터 확인
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved) as RSVPFormData;
        setSubmittedData(data);
        setStatus('success');
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const submitRSVP = async (data: RSVPFormData) => {
    setStatus('submitting');
    setError(null);

    try {
      await addDoc(collection(db, 'rsvp'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      // 로컬 스토리지에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSubmittedData(data);
      setStatus('success');
    } catch (err) {
      console.error('RSVP 제출 오류:', err);
      setError('참석 여부 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStatus('error');
    }
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSubmittedData(null);
    setStatus('idle');
    setError(null);
  };

  return { status, error, submittedData, submitRSVP, reset };
};
