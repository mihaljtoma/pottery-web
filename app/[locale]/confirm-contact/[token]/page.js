'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ConfirmContactPage() {
  const params = useParams();
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
          setMessage('Your request has been confirmed! We will contact you soon.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Confirmation failed or link expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong.');
      }
    };

    confirmContact();
  }, [params.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        {status === 'loading' && <p className="text-lg">Confirming your request...</p>}
        
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">✓ Confirmed!</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">✗ Error</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}