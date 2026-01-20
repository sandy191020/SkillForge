import { getOllamaResponse } from './ollama.mjs'

export async function evaluateAnswer(role, question, answer) {
    const prompt = `You are evaluating a candidate's answer in a technical interview.

Role: ${role}
Question: ${question}
Answer: ${answer}

Evaluate and return STRICTLY in JSON with this exact structure:

{
  "overall_score": <number between 1 and 10>,
  "dimensions": {
    "technical_depth": <number between 1 and 10>,
    "communication": <number between 1 and 10>,
    "problem_solving": <number between 1 and 10>
  },
  "summary_feedback": "<2-3 sentence feedback>",
  "tags": ["strength: ...", "weakness: ..."]
}

Do not include any explanation outside the JSON. Return only valid JSON.`

    try {
        const response = await getOllamaResponse(prompt)

        // Extract JSON from response (handle cases where LLM adds extra text)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('No JSON found in response')
        }

        const evaluation = JSON.parse(jsonMatch[0])

        // Validate structure
        if (!evaluation.overall_score || !evaluation.dimensions || !evaluation.summary_feedback) {
            throw new Error('Invalid evaluation structure')
        }

        return {
            overallScore: evaluation.overall_score,
            dimensions: {
                technical_depth: evaluation.dimensions.technical_depth,
                communication: evaluation.dimensions.communication,
                problem_solving: evaluation.dimensions.problem_solving
            },
            summaryFeedback: evaluation.summary_feedback,
            tags: evaluation.tags || []
        }
    } catch (error) {
        console.error('Error evaluating answer:', error)
        if (error.response) {
            console.error('Raw Ollama response:', error.response)
        }
        // Return default scores if evaluation fails
        return {
            overallScore: 5,
            dimensions: {
                technical_depth: 5,
                communication: 5,
                problem_solving: 5
            },
            summaryFeedback: `Evaluation unavailable. Error: ${error.message}`,
            tags: []
        }
    }
}

export async function generateFinalSummary(scores) {
    const scoresJson = JSON.stringify(scores, null, 2)

    const prompt = `Given this list of scores and feedback from an interview:

${scoresJson}

Write a concise summary (4–6 sentences) describing:
- The candidate's overall performance
- Main strengths
- Key areas to improve

Don't repeat raw numbers. Be professional and constructive.`

    try {
        const summary = await getOllamaResponse(prompt)
        return summary
    } catch (error) {
        console.error('Error generating summary:', error)
        return 'Summary generation unavailable.'
    }
}
