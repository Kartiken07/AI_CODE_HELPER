from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Code Complexity Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

client = None
if OPENROUTER_API_KEY:
    client = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
    )

MODEL = "nvidia/nemotron-3-super-120b-a12b:free"


class CodeRequest(BaseModel):
    code: str
    language: str = "python"
    platform: Optional[str] = None


class CodeReviewRequest(BaseModel):
    code: str
    language: str = "python"


class MultiLangRequest(BaseModel):
    code: str
    source_language: str
    target_languages: list[str]


class ChatRequest(BaseModel):
    message: str
    code: str
    language: str
    analysis_context: Optional[dict] = None


class AnalysisResponse(BaseModel):
    time_complexity: str
    space_complexity: str
    time_complexity_explanation: str
    space_complexity_explanation: str
    time_graph_data: list
    space_graph_data: list
    suggestions: list
    platform_suggestions: list
    optimized_code: str
    bottlenecks: list
    algorithm_patterns: list
    line_annotations: list
    recursion_tree: Optional[dict] = None
    heatmap_data: list
    test_cases: list
    performance_estimate: dict
    code_quality: dict
    animation_steps: list
    difficulty_estimate: dict
    learning_path: list
    flowchart: str
    eli5_explanation: str
    similar_problems: list
    multi_approaches: list


SYSTEM_PROMPT = """You are an expert code complexity analyzer. Analyze the given code and return a JSON response with ALL of these fields:

{
    "time_complexity": "O(n) notation",
    "space_complexity": "O(n) notation",
    "time_complexity_explanation": "Detailed explanation",
    "space_complexity_explanation": "Detailed explanation",
    "time_graph_data": [{"n": 1, "operations": val}, {"n": 5, "operations": val}, {"n": 10, "operations": val}, {"n": 20, "operations": val}, {"n": 50, "operations": val}, {"n": 100, "operations": val}, {"n": 200, "operations": val}, {"n": 500, "operations": val}, {"n": 1000, "operations": val}],
    "space_graph_data": [{"n": 1, "memory": val}, {"n": 5, "memory": val}, {"n": 10, "memory": val}, {"n": 20, "memory": val}, {"n": 50, "memory": val}, {"n": 100, "memory": val}, {"n": 200, "memory": val}, {"n": 500, "memory": val}, {"n": 1000, "memory": val}],
    "suggestions": ["optimization suggestions"],
    "platform_suggestions": ["platform-specific suggestions"],
    "optimized_code": "optimized version",
    "bottlenecks": ["identified bottlenecks"],
    "algorithm_patterns": [{"name": "Pattern", "confidence": 0.95, "description": "desc"}],
    "line_annotations": [{"line": 1, "complexity": "O(n)", "explanation": "desc"}],
    "recursion_tree": null,
    "heatmap_data": [{"line": 1, "severity": 0.8, "contribution": "high/medium/low", "reason": "explanation"}],
    "test_cases": [{"input": "sample", "expected_output": "expected", "description": "what this tests", "edge_case": false}],
    "performance_estimate": {"input_sizes": [{"n": 100, "time_ms": 0.5, "memory_mb": 0.01}, {"n": 1000, "time_ms": 5.0, "memory_mb": 0.1}, {"n": 10000, "time_ms": 50.0, "memory_mb": 1.0}, {"n": 100000, "time_ms": 500.0, "memory_mb": 10.0}, {"n": 1000000, "time_ms": 5000.0, "memory_mb": 100.0}], "bottleneck_operation": "desc", "optimization_potential": "high/medium/low"},
    "code_quality": {"overall_score": 85, "readability": 90, "maintainability": 80, "efficiency": 75, "best_practices": 85, "issues": ["issues"], "improvements": ["improvements"]},
    "animation_steps": [{"step": 1, "description": "desc", "code_highlight": [1, 2], "state": {"variables": {"i": 0}}, "operation_count": 1}],
    "difficulty_estimate": {
        "level": "Easy/Medium/Hard",
        "score": 3,
        "max_score": 5,
        "platform_difficulty": {"leetcode": "Easy/Medium/Hard", "gfg": "Easy/Medium/Hard"},
        "reasoning": "Why this difficulty",
        "prerequisites": ["concepts needed"],
        "similar_difficulty_problems": ["problem names"]
    },
    "learning_path": [
        {"topic": "Topic Name", "resource": "Article/Video/Tutorial", "url": "https://...", "difficulty": "beginner/intermediate/advanced", "description": "What you'll learn", "relevance": "How it relates to this code"}
    ],
    "eli5_explanation": "Explain this code like explaining to a 5-year old.",
    "similar_problems": [
        {"name": "Problem Name", "platform": "leetcode/gfg", "difficulty": "Easy/Medium/Hard", "url": "https://...", "pattern": "Pattern used", "description": "Brief description", "similarity_reason": "Why this is similar"}
    ],
    "multi_approaches": [
        {"name": "Approach Name", "code": "implementation code", "time_complexity": "O(n)", "space_complexity": "O(n)", "explanation": "How this approach works", "pros": ["pros"], "cons": ["cons"], "best_for": "When to use this"}
    ],
    "flowchart": "Mermaid flowchart syntax string"
}

Return ONLY valid JSON, no markdown, no extra text."""


def parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        start = text.find("[")
        end = text.rfind("]") + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        raise


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_code(request: CodeRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    platform_context = ""
    if request.platform:
        if request.platform.lower() == "leetcode":
            platform_context = "Focus on LeetCode-specific suggestions."
        elif request.platform.lower() == "gfg":
            platform_context = "Focus on GeeksforGeeks-specific suggestions."

    user_prompt = f"""Analyze this {request.language} code comprehensively:

```{request.language}
{request.code}
```

{platform_context}

Provide ALL fields. Return as valid JSON only."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        content = response.choices[0].message.content.strip()
        result = parse_json_response(content)
        return AnalysisResponse(
            time_complexity=result.get("time_complexity", "O(n)"),
            space_complexity=result.get("space_complexity", "O(n)"),
            time_complexity_explanation=result.get("time_complexity_explanation", ""),
            space_complexity_explanation=result.get("space_complexity_explanation", ""),
            time_graph_data=result.get("time_graph_data", []),
            space_graph_data=result.get("space_graph_data", []),
            suggestions=result.get("suggestions", []),
            platform_suggestions=result.get("platform_suggestions", []),
            optimized_code=result.get("optimized_code", ""),
            bottlenecks=result.get("bottlenecks", []),
            algorithm_patterns=result.get("algorithm_patterns", []),
            line_annotations=result.get("line_annotations", []),
            recursion_tree=result.get("recursion_tree"),
            heatmap_data=result.get("heatmap_data", []),
            test_cases=result.get("test_cases", []),
            performance_estimate=result.get("performance_estimate", {}),
            code_quality=result.get("code_quality", {}),
            animation_steps=result.get("animation_steps", []),
            difficulty_estimate=result.get("difficulty_estimate", {}),
            learning_path=result.get("learning_path", []),
            flowchart=result.get("flowchart", ""),
            eli5_explanation=result.get("eli5_explanation", ""),
            similar_problems=result.get("similar_problems", []),
            multi_approaches=result.get("multi_approaches", []),
        )
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    context = ""
    if request.analysis_context:
        try:
            if isinstance(request.analysis_context, dict):
                tc = request.analysis_context.get("time_complexity", "N/A")
                sc = request.analysis_context.get("space_complexity", "N/A")
            else:
                tc = "N/A"
                sc = "N/A"
            context = f"\n\nPrevious analysis context:\n- Time Complexity: {tc}\n- Space Complexity: {sc}"
        except Exception:
            context = ""

    code_section = ""
    if request.code and request.code.strip():
        code_section = f"\n\nHere is the code:\n```{request.language}\n{request.code}\n```"

    user_prompt = f"""You are helping a developer understand their code.{code_section}{context}

The user asks: {request.message}

Provide a helpful, concise answer. If suggesting code changes, show the code."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant. Answer questions about code, suggest improvements, explain concepts, and help with debugging. Be concise but thorough. Use markdown formatting for code blocks."},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.5,
            max_tokens=2048,
        )
        return {"response": response.choices[0].message.content.strip()}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/translate")
async def translate_code(request: MultiLangRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")
    langs = ", ".join(request.target_languages)
    user_prompt = f"Translate this {request.source_language} code to: {langs}\n\n```{request.source_language}\n{request.code}\n```\n\nReturn JSON with translations and notes for each language."
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "Translate code between languages. Return JSON: {\"translations\": {\"lang\": \"code\"}, \"notes\": {\"lang\": \"notes\"}}"},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        content = response.choices[0].message.content.strip()
        return parse_json_response(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed = {".py", ".js", ".ts", ".java", ".cpp", ".c", ".go", ".rs", ".rb"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")
    content = await file.read()
    lang_map = {".py": "python", ".js": "javascript", ".ts": "javascript", ".java": "java", ".cpp": "cpp", ".c": "cpp", ".go": "go", ".rs": "rust", ".rb": "ruby"}
    return {"code": content.decode("utf-8"), "language": lang_map.get(ext, "plaintext"), "filename": file.filename}


@app.post("/api/code-smells")
async def detect_code_smells(request: CodeReviewRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    prompt = f"""Analyze this {request.language} code for code smells.

```{request.language}
{request.code}
```

Return JSON with "smells" array and "summary" object. Return ONLY valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a code quality expert. Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        content = response.choices[0].message.content.strip()
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/metrics")
async def get_code_metrics(request: CodeReviewRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    prompt = f"""Analyze this {request.language} code and calculate all code metrics.

```{request.language}
{request.code}
```

Return JSON with "metrics", "ratings", and "breakdown". Return ONLY valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a code metrics expert. Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        content = response.choices[0].message.content.strip()
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/code-review")
async def code_review(request: CodeReviewRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    prompt = f"""Perform a code review on this {request.language} code.

```{request.language}
{request.code}
```

Return JSON with "review", "issues", "highlights", "security", "best_practices". Return ONLY valid JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a senior code reviewer. Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
        content = response.choices[0].message.content.strip()
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "openrouter_configured": client is not None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
