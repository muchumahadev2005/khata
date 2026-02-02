import { useState, useEffect, useCallback } from 'react';

export interface VoiceCommand {
  customerName: string;
  amount: number;
  description: string;
  type: 'debt' | 'payment';
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass() as SpeechRecognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clear transcript after a short delay to prevent re-processing
      setTimeout(() => setTranscript(''), 100);
    };

    setRecognition(recognition);
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('');
      setError(null);
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setTranscript(''); // Clear transcript when manually stopping
    }
  }, [recognition, isListening]);

  const parseVoiceCommand = (text: string): VoiceCommand | null => {
    const lowerText = text.toLowerCase().trim();
    
    // Check for "entry" command format: "entry [name] [amount] for [item]"
    const entryPattern = /^entry\s+([a-zA-Z\s]+?)\s+(\d+(?:\.\d{2})?)\s+for\s+(.+)$/i;
    const entryMatch = text.match(entryPattern);
    
    if (entryMatch) {
      const [, customerName, amountStr, description] = entryMatch;
      const amount = parseFloat(amountStr);
      
      if (amount > 0 && customerName.trim()) {
        return {
          customerName: customerName.trim(),
          amount,
          description: description.trim(),
          type: 'debt'
        };
      }
    }
    
    // Fallback to existing parsing logic for other formats
    const amountMatch = lowerText.match(/(\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    
    if (amount === 0) return null;

    // Determine transaction type
    const isPayment = /paid|pay|gave|returned|clear/.test(lowerText);
    const type = isPayment ? 'payment' : 'debt';
    
    // Extract customer name (assumes name comes before amount or after specific keywords)
    let customerName = '';
    const namePatterns = [
      /(?:from|to|by)\s+([a-z\s]+?)(?:\s+(?:owes|paid|gave|for))/i,
      /^([a-z\s]+?)(?:\s+(?:owes|paid|gave|for))/i,
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        customerName = match[1].trim();
        break;
      }
    }
    
    // Extract description
    const descriptionMatch = lowerText.match(/for\s+(.+?)(?:\s+\d+|$)/);
    const description = descriptionMatch ? descriptionMatch[1] : 'General transaction';
    
    if (!customerName) return null;
    
    return {
      customerName,
      amount,
      description,
      type
    };
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    parseVoiceCommand,
    isSupported: !!recognition,
  };
};