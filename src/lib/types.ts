export interface Entity {
  id: string;
  name: string;
  type: 'road' | 'stock' | 'policy' | 'infrastructure' | 'other';
  currentState: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriftEvent {
  id: string;
  entityId: string;
  entityName: string;
  eventType: 'accident' | 'status_change' | 'policy_update' | 'news_alert';
  description: string;
  newState: string;
  timestamp: string;
}

export interface DriftAnalysis {
  id: string;
  entityId: string;
  entityName: string;
  previousState: string;
  currentState: string;
  driftDetected: boolean;
  changeSummary: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  explanation: string;
  recommendedAction: string;
  timestamp: string;
}

export interface AILog {
  id: string;
  entityId: string;
  entityName: string;
  requestData: { previous_state: string; current_state: string };
  responseData: DriftAnalysis;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
