interface KnowledgeProperty {
  prompt?: string;
  description?: string;
  instructions?: string[];
  extra_instructions?: string[];
  expected_output?: string;
}

export interface LoadKnowledgeInterface {
  assistant: string;
  agent_collection_name: string;
  website_urls?: any;
  pdf_urls?: any;
  property: KnowledgeProperty;
}
