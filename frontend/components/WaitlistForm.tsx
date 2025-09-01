import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { joinWaitlist } from '../lib/api';

interface WaitlistFormProps {
  source?: 'foreverdocs' | 'general';
  onClose: () => void;
}

interface FormData {
  email: string;
}

export default function WaitlistForm({ source = 'general', onClose }: WaitlistFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await joinWaitlist(data.email, source);
      toast.success(`You're #${response.position} on the waitlist!`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative glass-effect rounded-2xl p-8 max-w-md w-full animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-display mb-4">
          {source === 'foreverdocs' ? 'Join ForeverDocs Waitlist' : 'Join the Waitlist'}
        </h2>
        
        <p className="text-gray-300 mb-6">
          {source === 'foreverdocs'
            ? 'Be first to protect your family\'s generational wealth'
            : 'Get exclusive early access and updates'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-dark-200 border border-dark-300 focus:border-primary-500 focus:outline-none transition-colors"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      </div>
    </div>
  );
}
