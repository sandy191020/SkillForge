/**
 * Ollama Client using HTTP API
 * More reliable than spawn for streaming responses
 */

const OLLAMA_API = 'http://localhost:11434'
const MODEL = 'llama3.2' // Using llama3.2 as it's available

export async function streamOllamaResponse(prompt, onChunk, onComplete) {
  try {
    console.log('Sending request to Ollama...')
    
    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: true,
        options: {
          temperature: 0.7,        // More focused responses
          top_p: 0.9,             // Nucleus sampling
          top_k: 40,              // Limit vocabulary
          repeat_penalty: 1.2,    // Avoid repetition
          num_predict: 150,       // Limit response length
          stop: ['\n\n\n', 'Candidate:', 'Question 2:', 'Next question:'] // Stop at multiple questions
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        console.log('Ollama stream complete')
        onComplete()
        return fullResponse
      }

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          const json = JSON.parse(line)
          if (json.response) {
            fullResponse += json.response
            onChunk(json.response)
          }
          if (json.done) {
            console.log('Ollama generation done')
            onComplete()
            return fullResponse
          }
        } catch (e) {
          console.error('Error parsing Ollama response:', e)
        }
      }
    }
  } catch (error) {
    console.error('Ollama streaming error:', error)
    throw new Error(`Failed to get Ollama response: ${error.message}`)
  }
}

export async function getOllamaResponse(prompt) {
  try {
    console.log('Getting non-streaming response from Ollama...')
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200,
          top_p: 0.9,
          top_k: 40
        }
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Ollama response received')
    return data.response || ''
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Ollama request timeout')
      throw new Error('Request timeout - Ollama took too long to respond')
    }
    console.error('Ollama error:', error)
    throw new Error(`Failed to get Ollama response: ${error.message}`)
  }
}

// Test Ollama connection
export async function testOllamaConnection() {
  try {
    const response = await fetch(`${OLLAMA_API}/api/tags`)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Ollama is running')
      console.log('Available models:', data.models?.map(m => m.name).join(', '))
      return true
    }
    return false
  } catch (error) {
    console.error('❌ Ollama is not running:', error.message)
    return false
  }
}
