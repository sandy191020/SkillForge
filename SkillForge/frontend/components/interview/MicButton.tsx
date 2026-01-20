import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface MicButtonProps {
    onTranscript: (text: string) => void
}

export default function MicButton({ onTranscript }: MicButtonProps) {
    const [isRecording, setIsRecording] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false // Changed to false for better auto-stop
                recognition.interimResults = true
                recognition.lang = 'en-US'
                recognition.maxAlternatives = 1

                let finalTranscriptAccumulator = ''

                recognition.onresult = (event: any) => {
                    let interimTranscript = ''
                    let finalTranscript = ''
                    
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const transcript = event.results[i][0].transcript
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript
                        } else {
                            interimTranscript += transcript
                        }
                    }
                    
                    if (finalTranscript) {
                        finalTranscriptAccumulator += finalTranscript + ' '
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error)
                    setIsRecording(false)
                    if (event.error !== 'no-speech' && event.error !== 'aborted') {
                        onTranscript('Voice input failed: ' + event.error)
                    }
                }

                recognition.onend = () => {
                    setIsRecording(false)
                    // Send accumulated transcript when recognition ends
                    if (finalTranscriptAccumulator.trim()) {
                        onTranscript(finalTranscriptAccumulator.trim())
                        finalTranscriptAccumulator = ''
                    }
                }

                recognitionRef.current = recognition
            }
        }
    }, [onTranscript])

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser.')
            return
        }

        if (isRecording) {
            recognitionRef.current.stop()
            setIsRecording(false)
        } else {
            try {
                recognitionRef.current.start()
                setIsRecording(true)
            } catch (error) {
                console.error('Error starting recognition:', error)
            }
        }
    }

    return (
        <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all ${isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
            {isRecording ? (
                <MicOff className="w-5 h-5 text-white" />
            ) : (
                <Mic className="w-5 h-5 text-gray-700" />
            )}
        </button>
    )
}
