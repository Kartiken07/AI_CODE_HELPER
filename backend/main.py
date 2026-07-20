from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="Code Complexity Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


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


class ELI5Request(BaseModel):
    code: str
    language: str


class SimilarProblemsRequest(BaseModel):
    code: str
    language: str
    patterns: list[str]


class MultiApproachRequest(BaseModel):
    code: str
    language: str


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
    "eli5_explanation": "Explain this code like explaining to a 5-year old. Use simple analogies, everyday examples, and avoid jargon. Make it fun and relatable.",
    "similar_problems": [
        {"name": "Problem Name", "platform": "leetcode/gfg", "difficulty": "Easy/Medium/Hard", "url": "https://...", "pattern": "Pattern used", "description": "Brief description", "similarity_reason": "Why this is similar"}
    ],
    "multi_approaches": [
        {"name": "Approach Name", "code": "implementation code", "time_complexity": "O(n)", "space_complexity": "O(n)", "explanation": "How this approach works", "pros": ["pros"], "cons": ["cons"], "best_for": "When to use this"}
    ],
    "flowchart": "Mermaid flowchart syntax string representing the code logic"
}

For flowchart: use Mermaid.js syntax (e.g., flowchart TD, A[Start] --> B{Decision}, etc.)

For multi_approaches: provide 2-4 different approaches to solve the same problem with tradeoffs.

For eli5_explanation: be creative and use real-world analogies (cooking, sports, games, etc.)

For similar_problems: find 4-6 related problems from LeetCode and GFG.

For learning_path: suggest 3-5 resources (articles, videos, tutorials) with URLs.

For difficulty_estimate: rate 1-5 for LeetCode (Easy=1-2, Medium=3, Hard=4-5).

For graph data: O(1)=1, O(log n)=log2(n), O(n)=n, O(n log n)=n*log2(n), O(n^2)=n^2, O(n^3)=n^3, O(2^n)=min(2^n, 1e9), O(n!)=min(factorial(n), 1e9).

Return ONLY valid JSON, no markdown, no extra text."""


def parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    return json.loads(text)


def generate(prompt: str, system: str = "", temperature: float = 0.3) -> str:
    full_prompt = f"{system}\n\n{prompt}" if system else prompt
    response = model.generate_content(
        full_prompt,
        generation_config=genai.GenerationConfig(
            temperature=temperature,
            max_output_tokens=8192,
        ),
    )
    return response.text


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_code(request: CodeRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

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

Provide ALL fields: complexity, graphs, suggestions, optimized code, bottlenecks, patterns, annotations, heatmap, tests, performance, quality, animation, difficulty estimate, learning path, ELI5 explanation, similar problems, multiple approaches, and a Mermaid flowchart.

Return as valid JSON only."""

    try:
        content = generate(user_prompt, SYSTEM_PROMPT, 0.3)
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
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

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
        content = generate(
            user_prompt,
            "You are a helpful coding assistant. Answer questions about code, suggest improvements, explain concepts, and help with debugging. Be concise but thorough. Use markdown formatting for code blocks.",
            0.5,
        )
        return {"response": content.strip()}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/translate")
async def translate_code(request: MultiLangRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    langs = ", ".join(request.target_languages)
    user_prompt = f"Translate this {request.source_language} code to: {langs}\n\n```{request.source_language}\n{request.code}\n```\n\nReturn JSON with translations and notes for each language."
    try:
        content = generate(
            user_prompt,
            'Translate code between languages. Return JSON: {"translations": {"lang": "code"}, "notes": {"lang": "notes"}}',
            0.3,
        )
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
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    prompt = f"""Analyze this {request.language} code for code smells and anti-patterns.

```{request.language}
{request.code}
```

Return JSON with:
{{
    "smells": [
        {{
            "name": "Smell name",
            "severity": "critical/warning/info",
            "line": 5,
            "description": "What's wrong",
            "suggestion": "How to fix it",
            "category": "naming/complexity/duplication/length/coupling/bloat"
        }}
    ],
    "summary": {{
        "total_smells": 5,
        "critical": 1,
        "warnings": 2,
        "info": 2,
        "health_score": 75,
        "verdict": "Good/Fair/Poor"
    }}
}}
Return ONLY valid JSON."""

    try:
        content = generate(
            prompt,
            "You are a code quality expert. Detect code smells, anti-patterns, and bad practices. Return valid JSON only.",
            0.3,
        )
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/metrics")
async def get_code_metrics(request: CodeReviewRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    prompt = f"""Analyze this {request.language} code and calculate all code metrics.

```{request.language}
{request.code}
```

Return JSON with:
{{
    "metrics": {{
        "lines_of_code": 50,
        "blank_lines": 5,
        "comment_lines": 3,
        "code_lines": 42,
        "functions": 3,
        "classes": 1,
        "avg_function_length": 14,
        "max_function_length": 25,
        "avg_params_per_function": 2,
        "max_nesting_depth": 3,
        "cyclomatic_complexity": 8,
        "cognitive_complexity": 12,
        "maintainability_index": 72,
        "halstead_volume": 150,
        "difficulty": 8.5,
        "effort": 1275
    }},
    "ratings": {{
        "maintainability": "good/fair/poor",
        "readability": "good/fair/poor",
        "complexity": "low/medium/high",
        "testability": "easy/moderate/hard"
    }},
    "breakdown": [
        {{
            "function_name": "functionName",
            "lines": 15,
            "cyclomatic": 3,
            "parameters": 2,
            "nesting": 2
        }}
    ]
}}
Return ONLY valid JSON."""

    try:
        content = generate(
            prompt,
            "You are a code metrics expert. Calculate all standard code metrics. Return valid JSON only.",
            0.3,
        )
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/code-review")
async def code_review(request: CodeReviewRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    prompt = f"""Perform a thorough code review on this {request.language} code. Act like a senior developer reviewing a pull request.

```{request.language}
{request.code}
```

Return JSON with:
{{
    "review": {{
        "overall_rating": 1-5,
        "summary": "One paragraph summary of the review",
        "verdict": "APPROVE / REQUEST_CHANGES / COMMENT"
    }},
    "issues": [
        {{
            "severity": "critical/major/minor/suggestion",
            "line": 5,
            "category": "bug/security/performance/style/architecture",
            "title": "Issue title",
            "description": "Detailed description",
            "suggestion": "How to fix it",
            "code_suggestion": "Optional fixed code"
        }}
    ],
    "highlights": [
        {{
            "line": 10,
            "comment": "What's done well here"
        }}
    ],
    "security": {{
        "vulnerabilities": [
            {{
                "type": "Vulnerability type",
                "severity": "critical/high/medium/low",
                "line": 5,
                "description": "What's the risk",
                "fix": "How to fix it"
            }}
        ],
        "score": 85
    }},
    "best_practices": [
        "Practice 1",
        "Practice 2"
    ]
}}
Return ONLY valid JSON."""

    try:
        content = generate(
            prompt,
            "You are a senior code reviewer. Review code thoroughly for bugs, security, performance, style, and architecture. Return valid JSON only.",
            0.3,
        )
        return parse_json_response(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "gemini_configured": bool(GEMINI_API_KEY)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
