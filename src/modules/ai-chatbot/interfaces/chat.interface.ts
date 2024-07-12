import { AiAssistantType } from 'src/common/enums';

interface KnowledgeProperty {
  prompt?: string;
  description?: string;
  instructions?: string[];
  extra_instructions?: string[];
  expected_output?: string;
}

export interface AssistantChatInterface {
  message: string;
  stream: boolean;
  run_id: string;
  user_id: string;
  agent_collection_name: string;
  assistant: AiAssistantType;
  property: KnowledgeProperty;
}
