
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GuestBookEntry } from '../types';

interface FirestoreGuestBookEntry {
  name: string;
  message: string;
  createdAt: Timestamp | null;
  side?: 'groom' | 'bride' | 'both';
  photoUrl?: string;
}

export const useGuestBook = () => {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: GuestBookEntry[] = snapshot.docs.map((doc) => {
          const docData = doc.data() as FirestoreGuestBookEntry;
          return {
            id: doc.id,
            name: docData.name,
            message: docData.message,
            createdAt: docData.createdAt?.toDate() || new Date(),
            side: docData.side,
            photoUrl: docData.photoUrl,
          };
        });
        setEntries(data);
        setLoading(false);
      },
      (err) => {
        console.error('방명록 로드 오류:', err);
        setError('방명록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEntry = async (entry: Omit<GuestBookEntry, 'id' | 'createdAt'>) => {
    setSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'guestbook'), {
        ...entry,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('방명록 작성 오류:', err);
      setError('메시지 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { entries, loading, error, submitting, addEntry };
};
