import { motion } from 'framer-motion';
import { Check, Pencil } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  isLocked: boolean;
  onLock: () => void;
  onEdit: () => void;
  placeholder: string;
  isChalkboard?: boolean;
}

export default function NameInput({
  value,
  onChange,
  isLocked,
  onLock,
  onEdit,
  placeholder,
  isChalkboard = false,
}: NameInputProps) {
  return (
    <div className="relative">
      {isLocked ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 ${isChalkboard ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-handwriting text-xl ${isChalkboard ? 'text-white' : 'text-gray-800 dark:text-white'}`}
            >
              {value}
            </span>
            <Button
              variant={isChalkboard ? 'ghost' : 'secondary'}
              size="sm"
              icon={Pencil}
              onClick={onEdit}
              aria-label="Edit name"
            />
          </div>
          <motion.div
            className={`absolute right-0 bottom-0 left-0 h-0.5 ${isChalkboard ? 'bg-white/50' : 'bg-orange-500'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`font-handwriting w-full rounded-lg border-2 px-4 py-3 text-xl transition-all duration-200 ${
              isChalkboard
                ? 'border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 focus:border-white/50'
                : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-orange-900'
            }`}
          />
          {value.trim() && (
            <Button
              variant={isChalkboard ? 'secondary' : 'primary'}
              size="sm"
              icon={Check}
              onClick={onLock}
              className="absolute top-1/2 right-2 -translate-y-1/2"
              aria-label="Lock name"
            />
          )}
        </div>
      )}
    </div>
  );
}
