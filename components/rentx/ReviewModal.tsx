'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Loader2 } from 'lucide-react';
import { createReview } from '@/lib/firestore-helpers';
import CustomModal from '@/components/rentx/CustomModal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    serviceId: string;
    serviceTitle: string;
    providerId: string;
    providerName: string;
    clientId: string;
    clientName: string;
  };
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, booking, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'confirm' | 'error';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    setLoading(true);
    try {
      await createReview({
        bookingId: booking.id,
        serviceId: booking.serviceId,
        providerId: booking.providerId,
        clientId: booking.clientId,
        clientName: booking.clientName,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setModalConfig({
        isOpen: true,
        title: 'Submission Error',
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Rate this Service</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">
                  {booking.serviceTitle} • By {booking.providerName}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-all hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-10 h-10 transition-all ${
                          (hover || rating) >= star 
                            ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(0,163,255,0.4)]' 
                            : 'text-white/10'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-sm font-black text-gray-500 uppercase tracking-widest">
                  {rating === 5 && 'Excellent!'}
                  {rating === 4 && 'Great'}
                  {rating === 3 && 'Good'}
                  {rating === 2 && 'Fair'}
                  {rating === 1 && 'Poor'}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  Your Experience
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about the quality of service, communication, and overall experience..."
                  required
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 px-8 py-3.5 bg-primary text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Submit Review <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="p-4 bg-primary/5 text-center">
              <p className="text-[10px] text-gray-500 font-medium">
                Your feedback helps the RENTX community stay safe and reliable.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <CustomModal
      isOpen={modalConfig.isOpen}
      title={modalConfig.title}
      message={modalConfig.message}
      type={modalConfig.type}
      onConfirm={modalConfig.onConfirm}
      onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
    />
    </>
  );
}
