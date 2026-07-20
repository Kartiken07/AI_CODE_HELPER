import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Languages, Loader2, Copy, Check } from "lucide-react";
import { apiFetch } from "../services/apiHelper";

const TARGET_LANGUAGES = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "go", label: "Go" },
];

const MultiLanguageCompare = ({ originalCode, sourceLanguage }) => {
  const [translations, setTranslations] = useState({});
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedLang, setCopiedLang] = useState(null);

  const toggleLang = (langId) => {
    setSelectedLangs((prev) =>
      prev.includes(langId) ? prev.filter((l) => l !== langId) : [...prev, langId]
    );
  };

  const handleTranslate = async () => {
    if (selectedLangs.length === 0 || !originalCode) return;
    setLoading(true);
    try {
      const data = await apiFetch("/translate", {
        method: "POST",
        body: JSON.stringify({
          code: originalCode,
          source_language: sourceLanguage,
          target_languages: selectedLangs,
        }),
      });
      setTranslations(data.translations || {});
    } catch {
      setTranslations({});
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code, lang) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const getMonacoLang = (lang) => {
    const map = { python: "python", javascript: "javascript", java: "java", cpp: "cpp", go: "go" };
    return map[lang] || "plaintext";
  };

  return (
    <div className="multilang-container">
      <div className="multilang-header">
        <Languages size={18} />
        <span>Multi-Language Compare</span>
      </div>

      <div className="multilang-selector">
        <span className="multilang-label">Translate to:</span>
        <div className="multilang-chips">
          {TARGET_LANGUAGES.filter((l) => l.id !== sourceLanguage).map((lang) => (
            <button
              key={lang.id}
              className={`multilang-chip ${selectedLangs.includes(lang.id) ? "active" : ""}`}
              onClick={() => toggleLang(lang.id)}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          className="multilang-go"
          onClick={handleTranslate}
          disabled={loading || selectedLangs.length === 0}
        >
          {loading ? <Loader2 size={14} className="spinner" /> : "Translate"}
        </button>
      </div>

      {Object.keys(translations).length > 0 && (
        <div className="multilang-results">
          {Object.entries(translations).map(([lang, code]) => (
            <div key={lang} className="multilang-pane">
              <div className="multilang-pane-header">
                <span>{lang}</span>
                <button
                  className="multilang-copy"
                  onClick={() => handleCopy(code, lang)}
                >
                  {copiedLang === lang ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="multilang-editor">
                <Editor
                  height="250px"
                  language={getMonacoLang(lang)}
                  value={code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    minimap: { enabled: false },
                    padding: { top: 8, bottom: 8 },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiLanguageCompare;
