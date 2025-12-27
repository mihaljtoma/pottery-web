'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ConfirmContactPage() {
  const params = useParams();
  const t = useTranslations('confirmContact');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmContact = async () => {
      try {
        const res = await fetch(`/api/confirm-contact/${params.token}`, {
          method: 'POST'
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(t('success'));
        } else {
          setStatus('error');
          setMessage(data.error || t('linkExpired'));
        }
      } catch (error) {
        setStatus('error');
        setMessage(t('error'));
      }
    };

    confirmContact();
  }, [params.token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-amber-50 p-8 rounded-lg shadow-lg text-center max-w-md">
        {status === 'loading' && <p className="text-lg">{t('loading')}</p>}
        
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">{t('confirmed')}</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{t('errorTitle')}</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}