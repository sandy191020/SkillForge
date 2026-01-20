import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import multer from 'multer'
import { streamOllamaResponse } from './ollamaClient.js'
import { evaluateAnswer, generateFinalSummary } from './scoring.js'
import { transcribeAudio } from './whisperService.js'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/interview' })

app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

// Store session data per WebSocket connection
const sessions = new Map()

function getSystemPrompt(role) {
  return `You are a professional technical interviewer conducting a ${role} interview.

CRITICAL RULES:
1. Ask ONLY ONE question at a time
2. After the candidate answers, provide brief feedback (1-2 sentences)
3. Then ask the NEXT question
4. NEVER ask multiple questions in one response
5. NEVER repeat questions
6. Keep responses under 100 words
7. Be conversational and natural
8. Focus on practical, real-world scenarios
9. Progress from basic to advanced topics
10. Listen to the candidate's answer before asking the next question

RESPONSE FORMAT:
[Brief feedback on their answer]
[One new question]

Example:
"Good point about using async/await. That shows understanding of modern JavaScript.

Now, can you explain how you would handle error boundaries in a React application?"

Remember: ONE question per response. Wait for their answer before continuing.`
}

function buildChatPrompt(systemPrompt, chatHistory) {
  let prompt = systemPrompt + '\n\n'
  chatHistory.forEach(msg => {
    if (msg.role === 'user') {
      prompt += `Candidate: ${msg.content}\n\n`
    } else {
      prompt += `Interviewer: ${msg.content}\n\n`
    }
  })
  prompt += 'Interviewer: '
  return prompt
}

wss.on('connection', (ws) => {
  console.log('New WebSocket connection')

  const sessionId = Date.now().toString()
  sessions.set(sessionId, {
    role: '',
    chatHistory: [],
    questionsAsked: 0,
    scores: [],
    lastQuestion: ''
  })

  ws.sessionId = sessionId

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message)
      const session = sessions.get(sessionId)

      if (data.type === 'init') {
        session.role = data.role

        // Send greeting
        const greeting = `Hi! I'm excited to interview you for the ${data.role} position. Let's have a conversation about your experience and skills.`
        session.chatHistory.push({ role: 'assistant', content: greeting })

        ws.send(JSON.stringify({ type: 'greeting', message: greeting }))

        // Generate first question with better context
        try {
          const systemPrompt = getSystemPrompt(data.role)
          const prompt = systemPrompt + '\n\nInterviewer: Start with a warm-up question about their background or experience. Keep it simple and conversational. Ask only ONE question.'

          let fullResponse = ''
          await streamOllamaResponse(
            prompt,
            (chunk) => {
              fullResponse += chunk
              ws.send(JSON.stringify({ type: 'ai_stream', chunk }))
            },
            () => {
              session.chatHistory.push({ role: 'assistant', content: fullResponse })
              session.lastQuestion = fullResponse
              session.questionsAsked++
              ws.send(JSON.stringify({
                type: 'ai_done',
                question: fullResponse
              }))
            }
          )
        } catch (error) {
          console.error('Error generating first question:', error)
          const fallbackQuestion = `Tell me about your experience with ${data.role} technologies.`
          session.chatHistory.push({ role: 'assistant', content: fallbackQuestion })
          session.lastQuestion = fallbackQuestion
          session.questionsAsked++
          ws.send(JSON.stringify({
            type: 'ai_stream',
            chunk: fallbackQuestion
          }))
          ws.send(JSON.stringify({
            type: 'ai_done',
            question: fallbackQuestion
          }))
        }
      }

      if (data.type === 'user_message') {
        const userMessage = data.message
        session.chatHistory.push({ role: 'user', content: userMessage })

        // Store the question that was answered
        const answeredQuestion = session.lastQuestion

        // Generate interviewer response
        try {
          const systemPrompt = getSystemPrompt(session.role)
          const prompt = buildChatPrompt(systemPrompt, session.chatHistory)

          let fullResponse = ''
          await streamOllamaResponse(
            prompt,
            (chunk) => {
              fullResponse += chunk
              ws.send(JSON.stringify({ type: 'ai_stream', chunk }))
            },
            async () => {
              // Post-process response to ensure only one question
              let processedResponse = fullResponse.trim()

              // If multiple questions detected, keep only the first one
              const questionMarkers = processedResponse.split(/\n\n(?=.*\?)/g)
              if (questionMarkers.length > 2) {
                // Keep feedback + first question only
                processedResponse = questionMarkers.slice(0, 2).join('\n\n')
              }

              // Limit response length
              if (processedResponse.length > 300) {
                const sentences = processedResponse.split(/(?<=[.!?])\s+/)
                processedResponse = sentences.slice(0, 3).join(' ')
              }

              session.chatHistory.push({ role: 'assistant', content: processedResponse })
              session.lastQuestion = processedResponse
              session.questionsAsked++
              ws.send(JSON.stringify({
                type: 'ai_done',
                question: processedResponse
              }))

              // Evaluate the answer in background
              try {
                const evaluation = await evaluateAnswer(
                  session.role,
                  answeredQuestion,
                  userMessage
                )

                session.scores.push({
                  questionId: session.scores.length + 1,
                  questionText: answeredQuestion,
                  userAnswer: userMessage,
                  ...evaluation
                })

                ws.send(JSON.stringify({
                  type: 'score_update',
                  payload: evaluation
                }))
              } catch (error) {
                console.error('Error evaluating answer:', error)
                // Send default score
                const defaultScore = {
                  overallScore: 7,
                  dimensions: {
                    technical_depth: 7,
                    communication: 7,
                    problem_solving: 7
                  },
                  summaryFeedback: 'Good answer. Keep practicing!',
                  tags: []
                }
                ws.send(JSON.stringify({
                  type: 'score_update',
                  payload: defaultScore
                }))
              }
            }
          )
        } catch (error) {
          console.error('Error generating response:', error)
          const fallbackResponse = 'Thank you for your answer. Let me ask you another question: What challenges have you faced in your role?'
          session.chatHistory.push({ role: 'assistant', content: fallbackResponse })
          session.lastQuestion = fallbackResponse
          session.questionsAsked++
          ws.send(JSON.stringify({ type: 'ai_stream', chunk: fallbackResponse }))
          ws.send(JSON.stringify({ type: 'ai_done', question: fallbackResponse }))
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
      ws.send(JSON.stringify({ type: 'error', message: 'An error occurred' }))
    }
  })

  ws.on('close', () => {
    console.log('WebSocket connection closed')
    sessions.delete(sessionId)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

// Speech-to-Text endpoint
app.post('/stt', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const text = await transcribeAudio(req.file.buffer)
    res.json({ text })
  } catch (error) {
    console.error('STT error:', error)
    res.status(500).json({ error: 'Transcription failed', details: error.message })
  }
})

// Generate final summary endpoint
app.post('/generate-summary', async (req, res) => {
  try {
    const { scores } = req.body
    const summary = await generateFinalSummary(scores)
    res.json({ summary })
  } catch (error) {
    console.error('Summary generation error:', error)
    res.status(500).json({ error: 'Summary generation failed' })
  }
})

// Mint certificate endpoint




const PORT = 5000
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`WebSocket available at ws://localhost:${PORT}/interview`)

  // Test Ollama connection
  const { testOllamaConnection } = await import('./ollamaClient.js')
  await testOllamaConnection()
})
