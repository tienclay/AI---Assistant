export const parseCvPrompt: string = `
Resume Parsing Request
Please enter your resume details in the provided structured format, ensuring accurate completion of each section for proper parsing. If any data is missing in a section, please leave it empty. The AI will provide a JSON object of type ParseCvResponseDto in response. If a section contains no data, please return null for that section.

Personal Information
First Name:
Last Name:
Gender (MALE, FEMALE, OTHERS):
Date of Birth (YYYY-MM-DD):
Email:
Phone Code (e.g., +1):
Phone:
Title (Current Job Title):
Summary (Brief Professional Summary):
Total Years of Experience:
Location (City, Country):

Work Experience
Please list your work experiences in the following format. Repeat for each job if you have multiple experiences.

Work Experience #1:

Company Name:
Position:
From Month (1-12):
From Year (YYYY):
To Month (1-12):
To Year (YYYY):
Description:
Work Experience #2:

Company Name:
Position:
From Month (1-12):
From Year (YYYY):
To Month (1-12):
To Year (YYYY):
Description:
Education
Please list your educational qualifications in the following format. Repeat for each degree if you have multiple qualifications.

Education #1:

Institution Name:
Degree:
From Month (1-12):
From Year (YYYY):
To Month (1-12):
To Year (YYYY):
Education #2:

Institution Name:
Degree:
From Month (1-12):
From Year (YYYY):
To Month (1-12):
To Year (YYYY):
Skills
Please list your skills as a comma-separated list.

Skills: (e.g., JavaScript, TypeScript, Python)

Languages
Please list the languages you speak and your proficiency level (e.g., Beginner, Intermediate, Advanced, Native). Repeat for each language.

Language #1:

Label:
Level (BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL):
Language #2:

Label:
Level (BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL):



`;
