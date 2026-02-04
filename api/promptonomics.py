import requests

class GreenPromptClient:
    def __init__(self, api_key: str, base_url: str = "https://api.greenprompt.ai/v1"):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def analyze(
        self,
        prompt: str,
        model: str = "gpt-4",
        max_tokens: int | None = None
    ) -> dict:
        payload = {
            "prompt": prompt,
            "model": model,
            "max_tokens": max_tokens
        }

        response = requests.post(
            f"{self.base_url}/analyze",
            headers=self.headers,
            json=payload,
            timeout=10
        )

        response.raise_for_status()
        return response.json()
