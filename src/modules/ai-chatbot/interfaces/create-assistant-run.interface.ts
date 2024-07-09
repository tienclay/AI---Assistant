import { AiAssistantType } from 'src/common/enums';

export interface CreateAssistantRunInterface {
  user_id: string;

  assistant: AiAssistantType;

  agent_collection_name: string;

  prompt: string;
}
