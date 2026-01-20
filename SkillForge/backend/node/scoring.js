import { getOllamaResponse } from './ollamaClient.js'

export async function evaluateAnswer(role, question, answer) {
  // Simple rule-based evaluation as fallback
  const simpleEvaluation = generateSimpleEvaluation(answer)
  
  // If answer is too short, return simple evaluation immediately
  if (answer.trim().split(/\s+/).length < 5) {
    return {
      ...simpleEvaluation,
      summaryFeedback: "Your answer was quite brief. Try to provide more detailed explanations."
    }
  }
  
  const prompt = `Evaluate this interview answer and respond with ONLY a JSON object:

Role: ${role}
Question: ${question}
Answer: ${answer}

JSON format (copy exactly):
{
  "overall_score": 7,
  "dimensions": {
    "technical_depth": 7,
    "communication": 7,
    "problem_solving": 7
  },
  "summary_feedback": "Brief feedback here",
  "tags": ["strength: something"]
}

Return ONLY the JSON above with your scores. No other text.`

  try {
    const response = await getOllamaResponse(prompt)
    
    // Try to extract JSON from response
    let jsonStr = response.trim()
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // Find JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in response, using simple evaluation')
      return simpleEvaluation
    }
    
    const evaluation = JSON.parse(jsonMatch[0])
    
    // Validate and normalize structure
    const overallScore = Number(evaluation.overall_score) || Number(evaluation.overallScore) || simpleEvaluation.overallScore
    const dimensions = evaluation.dimensions || {}
    
    return {
      overallScore: Math.min(10, Math.max(1, overallScore)),
      dimensions: {
        technical_depth: Math.min(10, Math.max(1, Number(dimensions.technical_depth) || overallScore)),
        communication: Math.min(10, Math.max(1, Number(dimensions.communication) || overallScore)),
        problem_solving: Math.min(10, Math.max(1, Number(dimensions.problem_solving) || overallScore))
      },
      summaryFeedback: evaluation.summary_feedback || evaluation.summaryFeedback || simpleEvaluation.summaryFeedback,
      tags: Array.isArray(evaluation.tags) ? evaluation.tags : simpleEvaluation.tags
    }
  } catch (error) {
    console.error('Error evaluating answer:', error.message)
    // Return simple rule-based evaluation instead of error message
    return simpleEvaluation
  }
}

// Simple rule-based evaluation as fallback
function generateSimpleEvaluation(answer) {
  const wordCount = answer.trim().split(/\s+/).length
  const hasCodeKeywords = /function|class|const|let|var|return|if|for|while|async|await/i.test(answer)
  const hasExplanation = wordCount > 20
  
  let score = 5 // Base score
  
  // Adjust based on answer quality
  if (wordCount > 50) score += 1
  if (wordCount > 100) score += 1
  if (hasCodeKeywords) score += 1
  if (hasExplanation) score += 1
  if (wordCount < 10) score -= 2
  
  score = Math.min(10, Math.max(1, score))
  
  const feedback = wordCount < 10 
    ? "Try to provide more detailed explanations in your answers."
    : wordCount > 50
    ? "Good detailed answer! Keep up the thorough explanations."
    : "Solid answer. Consider adding more specific examples."
  
  return {
    overallScore: score,
    dimensions: {
      technical_depth: score,
      communication: Math.min(10, score + 1),
      problem_solving: score
    },
    summaryFeedback: feedback,
    tags: wordCount > 50 ? ["strength: detailed response"] : ["area to improve: add more detail"]
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
