import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

/**
 * Transcribe audio using Whisper
 * Note: This is a placeholder implementation
 * For production, install Whisper: pip install openai-whisper
 */
export async function transcribeAudio(audioBuffer) {
  console.log('📝 Transcription requested, audio size:', audioBuffer.length, 'bytes')
  
  // For now, return a helpful message
  // Users can type their answers instead
  const message = 'Voice input is not configured. Please type your answer instead.\n\nTo enable voice input:\n1. Install Whisper: pip install openai-whisper\n2. Restart the server'
  
  console.log('⚠️ Whisper not configured, returning placeholder')
  return message
}

/**
 * Alternative: Use Whisper if installed
 * Uncomment this code if you have Whisper installed
 */
/*
import { spawn } from 'child_process'

export async function transcribeAudio(audioBuffer) {
  return new Promise((resolve) => {
    const tempFile = join(tmpdir(), `audio-${Date.now()}.webm`)
    
    try {
      console.log('💾 Saving audio file:', tempFile)
      writeFileSync(tempFile, audioBuffer)
      
      console.log('🎤 Starting Whisper transcription...')
      const proc = spawn('whisper', [
        tempFile,
        '--model', 'base',
        '--output_format', 'txt',
        '--output_dir', tmpdir(),
        '--language', 'en',
        '--fp16', 'False'
      ])

      let output = ''
      let errorOutput = ''

      proc.stdout.on('data', (data) => {
        const text = data.toString()
        console.log('Whisper output:', text)
        output += text
      })

      proc.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      proc.on('close', (code) => {
        cleanupFile(tempFile)

        if (code === 0) {
          // Try to read the output file
          const outputFile = tempFile.replace('.webm', '.txt')
          try {
            if (existsSync(outputFile)) {
              const transcription = readFileSync(outputFile, 'utf-8')
              cleanupFile(outputFile)
              console.log('✅ Transcription:', transcription)
              resolve(transcription.trim() || 'No speech detected')
            } else {
              // Parse from stdout
              const lines = output.split('\n').filter(l => l.trim())
              const transcription = lines[lines.length - 1] || 'No speech detected'
              console.log('✅ Transcription:', transcription)
              resolve(transcription)
            }
          } catch (e) {
            console.error('Error reading transcription:', e)
            resolve('Could not read transcription')
          }
        } else {
          console.error('❌ Whisper failed:', errorOutput)
          resolve('Transcription failed - please type your answer')
        }
      })

      proc.on('error', (error) => {
        console.error('❌ Whisper error:', error)
        cleanupFile(tempFile)
        resolve('Whisper not installed - please type your answer')
      })

    } catch (error) {
      console.error('❌ Transcription error:', error)
      cleanupFile(tempFile)
      resolve('Error processing audio - please type your answer')
    }
  })
}

function cleanupFile(filePath) {
  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath)
      console.log('🗑️ Cleaned up:', filePath)
    }
  } catch (e) {
    console.error('Error deleting file:', e.message)
  }
}
*/
