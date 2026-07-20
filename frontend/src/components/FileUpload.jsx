import { useRef } from "react";
import { Upload, FileCode, X } from "lucide-react";

const FileUpload = ({ onFileUpload, currentFile, onClearFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const code = event.target.result;
      const ext = file.name.split(".").pop();
      const langMap = {
        py: "python",
        js: "javascript",
        ts: "javascript",
        java: "java",
        cpp: "cpp",
        c: "cpp",
        go: "go",
      };
      onFileUpload(code, langMap[ext] || "plaintext", file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.rb"
        style={{ display: "none" }}
      />

      {currentFile ? (
        <div className="file-badge">
          <FileCode size={14} />
          <span>{currentFile}</span>
          <button className="file-remove" onClick={onClearFile}>
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          <Upload size={14} />
          <span>Upload File</span>
        </button>
      )}
    </div>
  );
};

export default FileUpload;
