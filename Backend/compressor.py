import os
import subprocess

def try_ffmpeg_minimal():
    input_file = "report.mp3"
    output_file = "compressed_final2.mp3"
    
    if not os.path.exists(input_file):
        print("[!] الملف غير موجود.")
        return

    print("[*] محاولة الضغط بأمر مبسط جداً...")
    
    # سنستخدم هنا "shell=True" لعل الويندوز يساعد في إدارة الذاكرة للبرنامج
    cmd = f'ffmpeg -y -i "{input_file}" -ab 16k -ac 1 "{output_file}"'
    
    try:
        # shell=True أحياناً يحل مشاكل الـ Access Violation في الويندوز
        exit_code = os.system(cmd)
        
        if exit_code == 0:
            print("[+] نجح الضغط أخيراً!")
            print(f"[*] الحجم الجديد: {os.path.getsize(output_file) / (1024*1024):.2f} MB")
        else:
            print(f"[!] فشل البرنامج بكود خروج: {exit_code}")
            print("\n--- نصيحة سريعة ---")
            print("يبدو أن نسخة FFmpeg التي لديك بها مشكلة.")
            print("حمل النسخة 'Essentials' المستقرة (Gyan.dev) وجرب مجدداً.")
            
    except Exception as e:
        print(f"[!] خطأ غير متوقع: {e}")

if __name__ == "__main__":
    try_ffmpeg_minimal()