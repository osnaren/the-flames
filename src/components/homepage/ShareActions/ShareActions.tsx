import { FlamesResult } from '@features/flamesGame/flames.types';
import Button from '@ui/Button';
import { Link2, Share2 } from 'lucide-react';

interface ShareActionsProps {
  onShare: () => void;
  onCopyLink: () => void;
  result: FlamesResult | null;
  className?: string;
}

/**
 * Component for displaying share actions
 * This can be reused in various contexts where sharing is needed
 */
export function ShareActions({ onShare, onCopyLink, result, className = '' }: ShareActionsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <Button
        onClick={onShare}
        variant="blue"
        icon={Share2}
        aria-label="Share your FLAMES result"
        disabled={!result}
        fullWidth
      >
        Share
      </Button>

      <Button
        onClick={onCopyLink}
        variant="green"
        icon={Link2}
        aria-label="Copy a shareable link to your result"
        disabled={!result}
        fullWidth
      >
        Copy Link
      </Button>
    </div>
  );
}

export default ShareActions;
