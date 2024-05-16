# Throws an error for missing prompt
POST {{APP_URL}}/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "temperature": 1.0
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Prompt cannot be empty"

# Throws an error for empty prompt
POST {{APP_URL}}/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "prompt": "",
    "temperature": 1.0
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Prompt cannot be empty"

# Throws an error invalid temperature
POST {{APP_URL}}/api/v1/chat
X-OpenAI-API-Key: {{API_KEY}}
{
    "prompt": "Some prompt text here",
    "temperature": -1.0
}
HTTP 400
[Asserts]
jsonpath "$.message" == "Temperature must be greater than 0.0"

# Throws an error for missing API key
POST {{APP_URL}}/api/v1/chat
{
    "prompt": "Some prompt text here",
    "temperature": 1.0
}
HTTP 401
[Asserts]
jsonpath "$.message" == "Missing OpenAI API key in header"
