import React, { useState } from 'react';
import axios from 'axios';
import { IoCloudUploadOutline } from "react-icons/io5"; 
import { FileWordOutlined, FilePdfOutlined, DownloadOutlined, GlobalOutlined } from '@ant-design/icons'; 

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [generatedFileName, setGeneratedFileName] = useState(""); 
  const [lang, setLang] = useState('en');

  const content = {
    en: {
      dir: 'ltr',
      font: "'Poppins', Segoe UI, sans-serif",
      title: "Smart Audio Transcription",
      subtitle: "Convert your audio files to text with accuracy",
      uploadButton: "Upload audio",
      dragDrop: "Or drag and drop",
      processing: "Processing...",
      downloadTitle: "Download",
      resultHeading: "Result",
      defaultResult: "Text will appear here after processing.",
      switchBtn: "AR",
      alert: "Please process a file first."
    },
    ar: {
      dir: 'rtl',
      font: 'Arial, sans-serif',
      title: "تفريغ الملفات الصوتية الذكي",
      subtitle: "حوّل ملفاتك الصوتية إلى نصوص بدقة",
      uploadButton: "ارفع ملفاً",
      dragDrop: "أو اسحب وأفلت",
      processing: "جاري المعالجة...",
      downloadTitle: "تحميل",
      resultHeading: "النتيجة",
      defaultResult: "النص سيظهر هنا بعد انتهاء المعالجة.",
      switchBtn: "EN",
      alert: "يرجى رفع ملف ومعالجته أولاً."
    }
  };

  const currentContent = content[lang];
  const colors = {
    bg: "#f8f9fa", 
    mainCardBg: "#ffffff", 
    primaryBlue: "#0070c0", 
    uploadButton: "#5087c1", 
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setResult("");
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:8000/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.transcription);
      setGeneratedFileName(response.data.fileName); 
    } catch (error) {
      setResult(lang === 'en' ? "Connection error." : "خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (type) => {
    if (!generatedFileName) { alert(currentContent.alert); return; }
    window.open(`http://localhost:8000/download/${type}/${generatedFileName}`, '_blank');
  };

  return (
    <div className="app-container" style={{ 
      direction: currentContent.dir, 
      fontFamily: currentContent.font,
      backgroundColor: colors.bg,
      transition: 'all 0.4s ease'
    }}>
      
      {/* زر تبديل اللغة */}
      <div className="lang-switcher" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
        <GlobalOutlined className="lang-icon" />
        <span className="lang-text">{currentContent.switchBtn}</span>
      </div>

      <header className="header">
        <div className="header-text">
          <h1>{currentContent.title}</h1>
          <p>{currentContent.subtitle}</p>
        </div>
        <div className="header-logos">
          <img src="/logo (2).png" alt="logo1" className="logo-main" />
          <img src="/logo (3).png" alt="logo2" className="logo-sub" />
        </div>
      </header>

      <main className="main-content">
        <div className="card shadow-sm">
          {/* قسم الرفع */}
          <div className="section upload-area">
            <div className="upload-box">
              <IoCloudUploadOutline className="cloud-icon" />
              <input type="file" id="audioUpload" hidden onChange={handleFileUpload} accept="audio/*,video/*" />
              <button className="upload-btn" onClick={() => document.getElementById('audioUpload').click()}>
                {loading ? currentContent.processing : currentContent.uploadButton}
              </button>
              <p className="file-name">{file ? file.name : currentContent.dragDrop}</p>
            </div>

            {loading && (
              <div className="loading-ui">
                <div className="spinner"></div>
                <div className="progress-bar"><div className="progress-fill"></div></div>
              </div>
            )}
          </div>

          {/* قسم النتيجة */}
          <div className="section result-area">
            <div className="download-bar">
              <span className="download-label"><DownloadOutlined /> {currentContent.downloadTitle}</span>
              <div className="download-icons">
                <FileWordOutlined className="icon-btn word" onClick={() => handleDownload('word')} />
                <FilePdfOutlined className="icon-btn pdf" onClick={() => handleDownload('pdf')} />
              </div>
            </div>

            <div className="result-container">
              <h4 className="result-title">{currentContent.resultHeading}</h4>
              <div className="result-text">{result || currentContent.defaultResult}</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer-logo">
        <img src="/logo (1).png" alt="footer-logo" className="footer-img" />
      </footer>

      <style>{`
        .app-container { min-height: 100vh; padding: 20px; display: flex; flex-direction: column; align-items: center; position: relative; }
        
        .lang-switcher {
          position: fixed; top: 20px; right: 25px; 
          background: white; border: 1px solid #ddd;
          padding: 8px 15px; border-radius: 30px;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: 0.3s; z-index: 2000;
        }
        [direction='rtl'] .lang-switcher { right: auto; left: 25px; }
        .lang-switcher:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.12); }
        .lang-text { font-weight: 700; color: #333; font-size: 14px; }
        .lang-icon { color: ${colors.primaryBlue}; font-size: 18px; }

        .header { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; align-items: center; margin: 40px 0; gap: 20px; }
        .header-text h1 { color: ${colors.primaryBlue}; font-size: 2rem; margin-bottom: 5px; }
        .logo-main { height: 90px; } .logo-sub { height: 60px; margin-top: 15px; }

        .main-content { width: 100%; max-width: 1000px; }
        .card { 
          background: white; border-radius: 24px; padding: 30px; 
          display: flex; gap: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); 
        }

        .section { flex: 1; min-width: 300px; }
        
        /* تعديل الـ upload-box لترتيب عمودي */
        .upload-box { 
          background: #f4f9ff; border: 2px dashed #b9d8e9; 
          border-radius: 20px; padding: 40px 20px; 
          display: flex; flex-direction: column; align-items: center; text-align: center; 
        }
        .cloud-icon { font-size: 50px; color: #a5b8c6; margin-bottom: 15px; }
        .upload-btn { 
          background: ${colors.uploadButton}; color: white; padding: 12px 25px; 
          border: none; border-radius: 30px; cursor: pointer; font-weight: 600; 
        }
        
        .result-text { 
          background: #fafcfe; border: 1px solid #eef2f5; border-radius: 12px; 
          padding: 20px; min-height: 250px; font-size: 14px; line-height: 1.7;
          max-height: 400px; overflow-y: auto; white-space: pre-wrap;
        }

        .download-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .download-icons { display: flex; gap: 10px; }
        .icon-btn { 
          font-size: 22px; cursor: pointer; padding: 8px; 
          border: 1px solid #eee; border-radius: 8px; transition: 0.2s; 
        }
        .icon-btn.word { color: #2b579a; } .icon-btn.pdf { color: #d93025; }
        .icon-btn:hover { background: #f0f0f0; transform: scale(1.1); }

        /* تعديل الفوتر ليتحرك مع اللغة ويكون صغير الحجم */
        .footer-logo { position: fixed; bottom: 20px; transition: all 0.4s ease; z-index: 10; }
        .footer-img { height: 22px; opacity: 0.5; width: auto; }
        [direction='rtl'] .footer-logo { right: 30px; } 
        [direction='ltr'] .footer-logo { left: 30px; }

        @media (max-width: 850px) {
          .card { flex-direction: column; gap: 30px; padding: 20px; }
          .header { flex-direction: column; text-align: center; }
          .header-logos { justify-content: center; }
          .logo-main { height: 70px; }
          .footer-logo { position: static; margin-top: 20px; padding-bottom: 20px; text-align: center; }
        }

        @media (max-width: 480px) {
          .header-text h1 { font-size: 1.5rem; }
          .upload-box { padding: 20px; }
          .lang-switcher { top: 10px; right: 10px; padding: 6px 12px; }
          [direction='rtl'] .lang-switcher { left: 10px; }
        }

        .spinner { 
          width: 25px; height: 25px; border: 3px solid #eee; 
          border-top: 3px solid ${colors.primaryBlue}; border-radius: 50%; 
          animation: spin 1s linear infinite; margin: 15px auto; 
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;