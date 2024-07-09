import { AiAssistantType } from 'src/common/enums';

export interface AgentHistory {
  run_id: string;
  user_id: string;
  assistant: AiAssistantType;
  agent_collection_name: string;
  prompt: string;
}
