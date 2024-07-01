import {
  Features,
  Integration,
  Languages,
  PrimaryObjective,
  Tone,
} from '../enums/prompt.enum';

export interface PromptData {
  client_name: string;
  contact_email: string;
  phone_number: string;
  company_name: string;
  website: string;
  objectives: PrimaryObjective[];
  industry: string;
  description: string;
  languages: Languages[];
  tone: Tone;
  features: Features[];
  integration: Integration[];
  specific_questions: string[];
  interaction_scenarios: string[];
  other_requirements: string[];
  additional_notes: string;
}
