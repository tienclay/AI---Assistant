import { AiAssistantType } from 'src/common/enums';

export interface AssistantChatInterface {
  message: string;
  stream: boolean;
  run_id: string;
  user_id: string;
  agent_collection_name: string;
  assistant: AiAssistantType;
}
