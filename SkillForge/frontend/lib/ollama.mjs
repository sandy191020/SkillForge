const OLLAMA_API = 'http://localhost:11434'
const MODEL = 'llama3.2' // Default model

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
            }),
        })

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`)
        }

        // Node.js fetch response body is a stream
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

        const response = await fetch(`${OLLAMA_API}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false,
            }),
        })

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('Ollama response received')
        return data.response || ''
    } catch (error) {
        console.error('Ollama error:', error)
        throw new Error(`Failed to get Ollama response: ${error.message}`)
    }
}

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
