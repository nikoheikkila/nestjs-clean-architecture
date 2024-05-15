POST http://localhost:3000/api/v1/chat
X-OpenAI-API-Key: something
{
    "prompt": "Hello",
    "temperature": 1.0
}
HTTP 200
[Asserts]
jsonpath "$.answer" == "Hello, I am ChatGPT"
jsonpath "$.temperature" == 1.0
jsonpath "$.duration" >= 0
