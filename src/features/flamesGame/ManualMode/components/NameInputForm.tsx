import { motion } from 'framer-motion';
import { BookOpen, Heart, Palette, Sparkles, User } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import type { DrawingMode, NameInputFormProps } from '../types';
import { validateNameInput } from '../utils';

export default function NameInputForm({
  onNamesSubmit,
  mode,
  onModeToggle,
  initialName1 = '',
  initialName2 = '',
}: NameInputFormProps) {
  const [name1, setName1] = useState(initialName1);
  const [name2, setName2] = useState(initialName2);
  const [name1Error, setName1Error] = useState<string>('');
  const [name2Error, setName2Error] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (isProcessing) return;

      // Validate names
      const error1 = validateNameInput(name1);
      const error2 = validateNameInput(name2);

      setName1Error(error1 || '');
      setName2Error(error2 || '');

      if (error1) {
        toast.error(`Name 1: ${error1}`);
        return;
      }

      if (error2) {
        toast.error(`Name 2: ${error2}`);
        return;
      }

      if (name1.toLowerCase() === name2.toLowerCase()) {
        const errorMsg = 'Names cannot be the same';
        setName1Error(errorMsg);
        setName2Error(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setIsProcessing(true);
      onNamesSubmit(name1, name2);
    },
    [name1, name2, onNamesSubmit, isProcessing]
  );

  const handleName1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName1(e.target.value);
      if (name1Error) setName1Error('');
    },
    [name1Error]
  );

  const handleName2Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName2(e.target.value);
      if (name2Error) setName2Error('');
    },
    [name2Error]
  );

  const getModeIcon = (currentMode: DrawingMode) => {
    return currentMode === 'chalkboard' ? BookOpen : Palette;
  };

  const getModeText = (currentMode: DrawingMode) => {
    return currentMode === 'chalkboard' ? 'Chalkboard' : 'Pen & Paper';
  };

  const getModeDescription = (currentMode: DrawingMode) => {
    return currentMode === 'chalkboard' ? 'Write with chalk on a blackboard' : 'Write with pen on paper';
  };

  const canSubmit = name1.trim() && name2.trim() && !name1Error && !name2Error && !isProcessing;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        mode === 'chalkboard'
          ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
          : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'
      }`}
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 opacity-10 ${
          mode === 'chalkboard'
            ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]'
            : 'bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]'
        }`}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <motion.div className="mb-4 flex items-center justify-center" whileHover={{ scale: 1.05 }}>
            <Heart className={`mr-2 h-8 w-8 ${mode === 'chalkboard' ? 'text-red-400' : 'text-red-500'}`} />
            <h1 className={`text-4xl font-bold ${mode === 'chalkboard' ? 'text-white' : 'text-gray-800'}`}>
              FLAMES Manual Mode
            </h1>
            <Sparkles className={`ml-2 h-8 w-8 ${mode === 'chalkboard' ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </motion.div>

          <p className={`text-lg ${mode === 'chalkboard' ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience FLAMES the old-school way! ✏️
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
          <div
            className={`rounded-xl p-6 backdrop-blur-sm ${
              mode === 'chalkboard'
                ? 'border border-white/20 bg-white/10'
                : 'border border-gray-200 bg-white/80 shadow-lg'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${mode === 'chalkboard' ? 'text-white' : 'text-gray-800'}`}>
                  Choose Your Style
                </h3>
                <p className={`text-sm ${mode === 'chalkboard' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getModeDescription(mode)}
                </p>
              </div>

              <Button
                variant={mode === 'chalkboard' ? 'secondary' : 'primary'}
                icon={getModeIcon(mode)}
                onClick={onModeToggle}
                className="ml-4"
              >
                {getModeText(mode)}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div
            className={`rounded-xl p-8 backdrop-blur-sm ${
              mode === 'chalkboard'
                ? 'border border-white/20 bg-white/10'
                : 'border border-gray-200 bg-white/90 shadow-xl'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name 1 Input */}
              <div>
                <label
                  htmlFor="name1"
                  className={`mb-2 block text-sm font-medium ${mode === 'chalkboard' ? 'text-white' : 'text-gray-700'}`}
                >
                  First Name
                </label>
                <div className="relative">
                  <User
                    className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform ${
                      mode === 'chalkboard' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <input
                    id="name1"
                    type="text"
                    value={name1}
                    onChange={handleName1Change}
                    className={`w-full rounded-lg border-2 py-3 pr-4 pl-10 transition-all duration-200 ${
                      name1Error
                        ? 'border-red-500 focus:border-red-500'
                        : mode === 'chalkboard'
                          ? 'border-white/30 bg-white/10 text-white placeholder-gray-400 focus:border-white/50'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-orange-500'
                    } focus:ring-2 focus:outline-none ${
                      name1Error
                        ? 'focus:ring-red-200'
                        : mode === 'chalkboard'
                          ? 'focus:ring-white/20'
                          : 'focus:ring-orange-200'
                    }`}
                    placeholder="Enter your name"
                    disabled={isProcessing}
                  />
                </div>
                {name1Error && <p className="mt-1 text-sm text-red-400">{name1Error}</p>}
              </div>

              {/* Name 2 Input */}
              <div>
                <label
                  htmlFor="name2"
                  className={`mb-2 block text-sm font-medium ${mode === 'chalkboard' ? 'text-white' : 'text-gray-700'}`}
                >
                  Second Name
                </label>
                <div className="relative">
                  <User
                    className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform ${
                      mode === 'chalkboard' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <input
                    id="name2"
                    type="text"
                    value={name2}
                    onChange={handleName2Change}
                    className={`w-full rounded-lg border-2 py-3 pr-4 pl-10 transition-all duration-200 ${
                      name2Error
                        ? 'border-red-500 focus:border-red-500'
                        : mode === 'chalkboard'
                          ? 'border-white/30 bg-white/10 text-white placeholder-gray-400 focus:border-white/50'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-orange-500'
                    } focus:ring-2 focus:outline-none ${
                      name2Error
                        ? 'focus:ring-red-200'
                        : mode === 'chalkboard'
                          ? 'focus:ring-white/20'
                          : 'focus:ring-orange-200'
                    }`}
                    placeholder="Enter their name"
                    disabled={isProcessing}
                  />
                </div>
                {name2Error && <p className="mt-1 text-sm text-red-400">{name2Error}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant={mode === 'chalkboard' ? 'secondary' : 'primary'}
                className="w-full py-3"
                disabled={!canSubmit}
              >
                {isProcessing ? 'Starting Manual Mode...' : 'Start Drawing Mode 🎨'}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div
            className={`rounded-lg p-4 ${
              mode === 'chalkboard' ? 'border border-white/10 bg-white/5' : 'border border-gray-200 bg-gray-50'
            }`}
          >
            <p className={`text-sm ${mode === 'chalkboard' ? 'text-gray-300' : 'text-gray-600'}`}>
              💡 After entering names, you'll get a canvas where you can manually cross out letters and write!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
