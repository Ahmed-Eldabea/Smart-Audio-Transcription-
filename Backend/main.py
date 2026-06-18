from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uuid
import shutil
from spire.doc import Document, FileFormat # Conversion library

# Importing translated functions from your processor engine
from Backend.processor import compress_audio, process_audio_to_docx

app = FastAPI()

# CORS Settings (Unified to prevent conflicts)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Working Directories
UPLOAD_DIR = "temp_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-audio")
async def handle_audio_upload(file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"raw_{job_id}_{file.filename}")
    compressed_path = os.path.join(UPLOAD_DIR, f"low_{job_id}.mp3")

    try:
        # 1. Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Compression
        success_compress, compress_res = compress_audio(input_path, compressed_path)
        if not success_compress:
            raise HTTPException(status_code=500, detail="Audio compression failed")

        # 3. Intelligent Processing (Produces formatted Word file)
        success_ai, ai_res = process_audio_to_docx(compressed_path)
        
        if not success_ai:
            raise HTTPException(status_code=500, detail=ai_res)

        # 4. Cleanup temporary audio files to save space
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(compressed_path): os.remove(compressed_path)

        # Return the formatted file name for the React frontend to handle download
        return {
            "status": "success",
            "transcription": "Processing completed successfully. Formatted file is ready for Word or PDF download.",
            "fileName": ai_res
        }

    except Exception as e:
        # To Define the error in Terminal
        print(f"\n[!] SERVER ERROR: {str(e)}\n") 
        
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(compressed_path): os.remove(compressed_path)
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to download Word or PDF based on the original Docx file
@app.get("/download/{file_type}/{file_name}")
async def download_file(file_type: str, file_name: str):
    word_path = os.path.join(os.getcwd(), file_name)
    
    if not os.path.exists(word_path):
        raise HTTPException(status_code=404, detail="Original file not found on server")

    # Serve formatted Word file
    if file_type == "word":
        return FileResponse(
            path=word_path, 
            filename=file_name, 
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    
    # Convert and serve PDF
    elif file_type == "pdf":
        pdf_name = file_name.replace(".docx", ".pdf")
        pdf_path = os.path.join(os.getcwd(), pdf_name)
        
        try:
            # Using Spire.Doc to convert Word to PDF while preserving formatting/Arabic
            doc = Document()
            doc.LoadFromFile(word_path)
            doc.SaveToFile(pdf_path, FileFormat.PDF)
            doc.Close()
            
            return FileResponse(
                path=pdf_path, 
                filename=pdf_name, 
                media_type='application/pdf'
            )
        except Exception as e:
            print(f"\n[!] PDF CONVERSION ERROR: {str(e)}\n")
            raise HTTPException(status_code=500, detail=f"Error converting file to PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Start server on all interfaces at port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)