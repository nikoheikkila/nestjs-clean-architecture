# Responds to a valid prompt and temperature with generated answer and duration
POST http://localhost:3000/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "prompt": "Explain in simple terms what benefits does a software development team gain with Clean Architecture?",
    "temperature": 1.0
}
HTTP 200
[Asserts]
jsonpath "$.answer" isString
jsonpath "$.temperature" == 1.0
jsonpath "$.duration" >= 0

# Throws an error for missing prompt
POST http://localhost:3000/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "temperature": 1.0
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Prompt cannot be empty"

# Throws an error for empty prompt
POST http://localhost:3000/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "prompt": "",
    "temperature": 1.0
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Prompt cannot be empty"

