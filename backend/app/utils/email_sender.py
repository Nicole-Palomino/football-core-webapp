import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

# used in crud_user.py 
async def send_email(to_email: str, subject: str, body: str):
    """
    Envía un correo electrónico utilizando el servidor SMTP de Gmail.
    Requiere que GMAIL_EMAIL y GMAIL_APP_PASSWORD estén configurados en .env.
    """
    from_email = settings.GMAIL_EMAIL
    app_password = settings.GMAIL_APP_PASSWORD

    if not from_email or not app_password:
        print("ERROR: Las credenciales de Gmail (GMAIL_EMAIL o GMAIL_APP_PASSWORD) no están configuradas en .env. No se pudo enviar el correo.")
        return

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() 
        server.login(from_email, app_password) 

        # Enviar el correo electrónico
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit() 
        print(f"Correo enviado exitosamente a {to_email}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"ERROR de autenticación SMTP al enviar correo a {to_email}: {e}")
        print("Asegúrate de que la 'contraseña de aplicación' de Gmail sea correcta y que el acceso para aplicaciones menos seguras no esté bloqueado (aunque la contraseña de aplicación es preferible).")
    except smtplib.SMTPException as e:
        print(f"ERROR SMTP al enviar correo a {to_email}: {e}")
    except Exception as e:
        print(f"ERROR inesperado al enviar correo a {to_email}: {e}")