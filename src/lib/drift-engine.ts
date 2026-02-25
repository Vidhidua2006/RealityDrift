import { DriftAnalysis } from './types';
import { v4 } from './utils-id';

// Simulated AI drift analysis (replace with real Groq API via backend later)
export function analyzeDrift(
  entityId: string,
  entityName: string,
  previousState: string,
  currentState: string
): DriftAnalysis {
  const prev = previousState.toLowerCase().trim();
  const curr = currentState.toLowerCase().trim();
  const identical = prev === curr;

  if (identical) {
    return {
      id: v4(),
      entityId,
      entityName,
      previousState,
      currentState,
      driftDetected: false,
      changeSummary: `No change: state remains '${currentState}' for ${entityName}.`,
      severity: 'LOW',
      confidence: 95 + Math.floor(Math.random() * 5),
      explanation: `The previous and current states are identical ('${currentState}'), indicating no semantic or material change in the entity's status. Any drift detection requires a difference in state, which is not present here.`,
      recommendedAction: 'No action required. Continue monitoring for subsequent state changes or additional attributes that could indicate meaningful drift.',
      timestamp: new Date().toISOString(),
    };
  }

  // Determine severity based on change magnitude
  const sevOptions: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
  const keywords = ['accident', 'crash', 'failure', 'critical', 'emergency', 'shutdown', 'bankrupt', 'collapse'];
  const hasHighKeyword = keywords.some(k => curr.includes(k) || prev.includes(k));
  const severity = hasHighKeyword ? 'HIGH' : (Math.abs(prev.length - curr.length) > 10 ? 'MEDIUM' : sevOptions[Math.floor(Math.random() * 2)]);
  const confidence = 85 + Math.floor(Math.random() * 13);

  return {
    id: v4(),
    entityId,
    entityName,
    previousState,
    currentState,
    driftDetected: true,
    changeSummary: `State changed from '${previousState}' to '${currentState}' for ${entityName}.`,
    severity,
    confidence,
    explanation: `The previous state ('${previousState}') and current state ('${currentState}') indicate a ${severity === 'HIGH' ? 'significant' : 'notable'} real-world event affecting the entity (${entityName}), representing a clear semantic and operational shift that could impact operations, safety, and planning.`,
    recommendedAction: severity === 'HIGH' 
      ? 'Immediate review recommended. Update dependent AI systems and flag for human oversight.'
      : 'Monitor situation. Consider updating downstream systems if drift persists.',
    timestamp: new Date().toISOString(),
  };
}
