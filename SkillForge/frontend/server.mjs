import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { WebSocketServer } from 'ws'
import { streamOllamaResponse, testOllamaConnection } from './lib/ollama.mjs'
import { evaluateAnswer } from './lib/scoring.mjs'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Store session data per WebSocket connection
const sessions = new Map()

function getSystemPrompt(role) {
    return `You are a friendly and professional technical interviewer for a ${role} position.

Your Goal: Assess the candidate's skills while keeping them calm and engaged.

Guidelines:
1. Ask ONE clear, relevant technical question at a time.
2. Wait for the candidate's answer.
3. After they answer:
   - Provide brief, constructive feedback (1-2 sentences). Start with something positive if possible.
   - Then ask the NEXT question.
4. If the candidate struggles, offer a small hint or ask a simpler follow-up.
5. Keep your responses concise (under 3-4 sentences total).

Tone: Encouraging, professional, and conversational. Do not be robotic.

Start immediately with the first question.`
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

app.prepare().then(async () => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })

    // Initialize WebSocket Server
    const wss = new WebSocketServer({ server, path: '/api/ws/interview' })

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

                    // Send greeting and first question
                    const greeting = `Welcome to your ${data.role} interview. Let's begin.`
                    session.chatHistory.push({ role: 'assistant', content: greeting })

                    ws.send(JSON.stringify({ type: 'greeting', message: greeting }))

                    // Generate first question
                    try {
                        const systemPrompt = getSystemPrompt(data.role)
                        const prompt = systemPrompt + '\n\nInterviewer: Ask the first interview question.'

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
                                session.chatHistory.push({ role: 'assistant', content: fullResponse })
                                session.lastQuestion = fullResponse
                                session.questionsAsked++
                                ws.send(JSON.stringify({
                                    type: 'ai_done',
                                    question: fullResponse
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

    server.listen(port, async () => {
        console.log(`> Ready on http://${hostname}:${port}`)
        console.log(`> WebSocket Server ready at ws://${hostname}:${port}/api/ws/interview`)

        // Test Ollama
        await testOllamaConnection()
    })
})
