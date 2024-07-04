export const parseCvPrompt: string = `
Resume Parsing Request

Please provide your resume details in the structured format below, ensuring accurate completion of each section. If any data is missing, please leave the corresponding field empty. The AI will generate a JSON object of type ParseCvResponseDto as a response. If a section contains no data, please return null for that section.

Personal Information:

firstName (string):
lastName (string):
gender (string) [MALE, FEMALE, OTHERS]:
dateOfBirth (string) [YYYY-MM-DD]:
email (string):
phoneCode (string) [e.g., +1]:
phone (string):
title (string) [Current Job Title]:
summary (string) [Brief Professional Summary]:
totalExperience (string) [Total Year of Experience]:
location (string) [City, Country]:
Work Experience:
Please provide details for each work experience in the following format. Repeat the section for each job if you have multiple experiences.

Work Experience #1:

companyName (string):
position (string):
fromMonth (integer) [1-12]:
fromYear (integer) [YYYY]:
toMonth (integer) [1-12]:
toYear (integer) [YYYY]:
description (string):
Work Experience #2:

companyName (string):
position (string):
fromMonth (integer) [1-12]:
fromYear (integer) [YYYY]:
toMonth (integer) [1-12]:
toYear (integer) [YYYY]:
description (string):
Education:
Please provide details for each educational qualification in the following format. Repeat the section for each degree if you have multiple qualifications.

Education #1:

institutionName (string):
degree (string):
fromMonth (integer) [1-12]:
fromYear (integer) [YYYY]:
toMonth (integer) [1-12]:
toYear (integer) [YYYY]:
Education #2:

institutionName (string):
degree (string):
fromMonth (integer) [1-12]:
fromYear (integer) [YYYY]:
toMonth (integer) [1-12]:
toYear (integer) [YYYY]:
Skills:
Please list your skills as a comma-separated list.

skills (string) [e.g., JavaScript, TypeScript, Python]
Languages:
Please list the languages you speak and your proficiency level. Repeat the section for each language.

Language #1:

label (string):
level (string) [BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL]:
Language #2:

label (string):
level (string) [BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL]:
Please ensure that the response adheres to this interface exactly, including camel case naming conventions.
`;
