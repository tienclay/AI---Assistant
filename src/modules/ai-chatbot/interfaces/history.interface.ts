import { AiAssistantType } from 'src/common/enums';

interface KnowledgeProperty {
  prompt?: string;
  description?: string;
  instructions?: string[];
  extra_instructions?: string[];
  expected_output?: string[];
}
export interface AgentHistory {
  run_id: string;
  user_id: string;
  assistant: AiAssistantType;
  agent_collection_name: string;
  property: KnowledgeProperty;
  model: string;
}
