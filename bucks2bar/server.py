# This is a FastAPI version of the main logic from src/js/main.js.
# It provides endpoints for username validation and chart generation.
# For chart generation, it uses matplotlib and returns a base64 PNG.

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import re
import matplotlib.pyplot as plt
import io
import os
import base64
import aiosmtplib
from email.message import EmailMessage


app = FastAPI()

# Allow CORS for localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex=r"^http://localhost(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERNAME_REGEX = re.compile(
    r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&~])[A-Za-z\d@$!%*?&~]{8,}$')


@app.post("/validate-username")
async def validate_username(username: str = Form(...)):
    valid = bool(USERNAME_REGEX.match(username))
    return JSONResponse({"valid": valid})


@app.post("/generate-chart")
async def generate_chart(request: Request):
    data = await request.json()
    income = data.get("income", [0]*12)
    expenses = data.get("expenses", [0]*12)
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    plt.figure(figsize=(10, 5))
    plt.bar(months, income, color='blue', alpha=0.5, label='Income')
    plt.bar(months, expenses, color='red', alpha=0.5,
            label='Expenses', bottom=income)
    plt.legend()
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    chart_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return JSONResponse({"chartImage": f"data:image/png;base64,{chart_base64}"})


@app.post("/send-chart")
async def send_chart(request: Request):
    # This is a stub. You would implement email sending here.
    data = await request.json()
    email = data.get("email")
    chart_image = data.get("chartImage")
    email_validator = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    if not email or not email_validator.match(email):
        return JSONResponse({"message": f"Invalid email address: {email}"}, status_code=400)

    # Send the email with the chart image attached using aiosmtplib
    # Extract base64 from data URL
    if chart_image and chart_image.startswith("data:image/png;base64,"):
        chart_base64 = chart_image.split(",", 1)[1]
        chart_bytes = base64.b64decode(chart_base64)
    else:
        return JSONResponse({"message": "Invalid chart image format."}, status_code=400)

    # Compose email
    msg = EmailMessage()
    msg["From"] = "bucks2bar@resend.dev"  # Change to your sender address
    msg["To"] = email
    msg["Subject"] = "Your Bucks2Bar Chart"
    msg.set_content("Attached is your Bucks2Bar chart.")
    msg.add_attachment(chart_bytes, maintype="image",
                       subtype="png", filename="bucks2bar-chart.png")
   # SMTP config (update with your SMTP server details)
    smtp_host = "smtp.resend.com"
    smtp_port = 587
    smtp_user = "resend"
    # Get Resend API key from the RESEND_API environment variable
    smtp_pass = os.getenv("RESEND_API")

    try:
        # Send the email without using SSL/TLS
        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_user,
            password=smtp_pass,
            start_tls=True,  # Explicitly enable STARTTLS
            use_tls=False     # Explicitly disable SSL/TLS
        )
        return JSONResponse({"message": "Chart sent successfully"})
    except Exception as e:
        return JSONResponse({"message": f"Failed to send chart: {e}"}, status_code=500)


@app.get("/", response_class=HTMLResponse)
async def index():
    # You would serve your HTML here, or use a template engine.
    return "<h1>Bucks2Bar FastAPI backend is running.</h1>"

# Check if this file is named server.py and if so, initialize and run the app.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3000)
