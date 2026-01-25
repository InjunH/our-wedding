
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare, Heart, Camera, X } from 'lucide-react';
import { uploadToS3, isValidImageFile, MAX_FILE_SIZE } from '../lib/s3-upload';

interface GuestBookFormProps {
  onSubmit: (data: { name: string; message: string; side?: 'groom' | 'bride' | 'both'; photoUrl?: string }) => Promise<void>;
  submitting: boolean;
}

const GuestBookForm: React.FC<GuestBookFormProps> = ({ onSubmit, submitting }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [side, setSide] = useState<'groom' | 'bride' | 'both'>('groom');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!isValidImageFile(file)) {
      setUploadError('JPG, PNG, GIF, WEBP 형식만 지원합니다.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      let photoUrl: string | undefined;

      if (selectedFile) {
        setUploading(true);
        try {
          photoUrl = await uploadToS3(selectedFile);
        } catch (err) {
          console.error('사진 업로드 오류:', err);
          setUploadError('사진 업로드에 실패했습니다. 다시 시도해주세요.');
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      await onSubmit({ name: name.trim(), message: message.trim(), side, photoUrl });
      setName('');
      setMessage('');
      removeFile();
    } catch (err) {
      // 에러는 useGuestBook에서 처리
    }
  };

  const isProcessing = submitting || uploading;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-12 border border-[#f2f0ea] space-y-6"
    >
      <h3 className="text-xl serif-kr font-normal mb-8 pb-6 border-b border-[#f2f0ea] text-[#2a2a2a]">축하 메시지 남기기</h3>

      <div className="space-y-2">
        <label className="label-wedding">
          <User size={12} /> 이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="이름을 입력해주세요"
          className="input-wedding"
        />
      </div>

      <div className="space-y-2">
        <label className="label-wedding">
          <Heart size={12} /> 신랑/신부측
        </label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as 'groom' | 'bride' | 'both')}
          className="input-wedding"
        >
          <option value="groom">신랑측</option>
          <option value="bride">신부측</option>
          <option value="both">함께</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="label-wedding">
          <MessageSquare size={12} /> 메시지
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="축하의 말씀을 남겨주세요"
          className="input-wedding resize-none"
        />
      </div>

      {/* 사진 첨부 */}
      <div className="space-y-2">
        <label className="label-wedding">
          <Camera size={12} /> 추억 사진 (선택)
        </label>

        {previewUrl ? (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-32 h-32 object-cover border border-[#f2f0ea]"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-[#e5e3de] hover:border-gold/50 cursor-pointer transition-colors bg-[#faf9f6]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <Camera size={24} className="mx-auto text-stone-300 mb-2" />
              <span className="text-xs text-stone-400">사진 추가</span>
            </div>
          </label>
        )}

        {uploadError && (
          <p className="text-red-500 text-xs mt-2">{uploadError}</p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={isProcessing || !name.trim() || !message.trim()}
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        className="w-full btn-gold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin">
              <Send size={14} />
            </span>
            {uploading ? '사진 업로드 중...' : '등록 중...'}
          </>
        ) : (
          <>
            <Send size={14} />
            메시지 남기기
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default GuestBookForm;
