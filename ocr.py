from flask import Flask, request, jsonify
import pytesseract
from pytesseract import Output
import cv2
import numpy as np
from flask_cors import CORS
from pdf2image import convert_from_bytes
import re
import gc

app = Flask(__name__)
CORS(app)

# ─────────────────────────────
# CONFIG
# ─────────────────────────────
PDF_DPI = 100          # antes 150. Menos memoria y menos tiempo de OCR.
BLUR_THRESHOLD = 150
MIN_READABLE_CHARS = 30
MIN_CONFIDENCE = 40


@app.route('/')
def home():
    return "Servidor funcionando"


def blurry_image(image, threshold=BLUR_THRESHOLD):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    score = cv2.Laplacian(gray, cv2.CV_64F).var()
    return score < threshold, score


def get_ocr_text_and_confidence(gray):
    """
    Corre tesseract UNA sola vez (en vez de image_to_string + image_to_data
    por separado) y devuelve tanto el texto como la confianza promedio.
    Esto reduce a la mitad el tiempo de OCR por imagen/página.
    """
    data = pytesseract.image_to_data(
        gray,
        lang='spa+eng',
        config="--oem 3 --psm 6",
        output_type=Output.DICT
    )

    words = []
    confidences = []

    for word, conf in zip(data['text'], data['conf']):
        try:
            conf = float(conf)
        except (TypeError, ValueError):
            continue

        if conf > 0:
            confidences.append(conf)
            if word.strip():
                words.append(word)

    text = " ".join(words)
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0

    return text, avg_confidence


def process_file(file):

    if file is None:
        raise Exception("File not received")

    filename = file.filename.lower()
    texto_documento = ""

    print("Procesando:", file.filename, flush=True)

    # ─────────────────────────────
    # PDF
    # ─────────────────────────────
    if filename.endswith(".pdf"):

        pdf_bytes = file.read()
        pages = convert_from_bytes(pdf_bytes, dpi=PDF_DPI)

        # liberamos los bytes crudos del PDF apenas convertimos a páginas
        del pdf_bytes

        for index, page in enumerate(pages):

            img = np.array(page)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

            blurry, score = blurry_image(img)
            print("blur score", score, flush=True)

            if blurry:
                raise Exception(
                    f"The page {index + 1} of {file.filename} is blurry"
                )

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)
            gray = cv2.threshold(
                gray,
                5,
                255,
                cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )[1]

            print("Iniciando OCR PDF página", index + 1, flush=True)

            text, confidence = get_ocr_text_and_confidence(gray)

            print("Terminando OCR PDF página", index + 1, flush=True)

            texto_limpio = re.sub(r'[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]', '', text)

            print("OCR confidence", confidence, flush=True)
            print("readable chars", len(texto_limpio), flush=True)

            if len(texto_limpio) < MIN_READABLE_CHARS:
                print("WARNING: low text length", flush=True)

            if confidence < MIN_CONFIDENCE:
                print("WARNING: low confidence", flush=True)

            texto_documento += text + "\n"

            # liberar memoria de la página procesada antes de seguir
            del img, gray, page
            gc.collect()

        del pages
        gc.collect()

    # ─────────────────────────────
    # IMAGE
    # ─────────────────────────────
    else:

        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        del npimg

        if img is None:
            raise Exception(f"Could not read {file.filename}")

        blurry, score = blurry_image(img)
        print("blur score", score, flush=True)

        if blurry:
            raise Exception(f"{file.filename} is blurry")

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        gray = cv2.threshold(
            gray,
            5,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        print("Iniciando OCR Imagen", flush=True)

        texto_documento, confidence = get_ocr_text_and_confidence(gray)

        print("Terminando OCR Imagen", flush=True)

        texto_limpio = re.sub(r'\s+', ' ', texto_documento).strip()

        print("OCR confidence:", confidence, flush=True)
        print("Readable chars:", len(texto_limpio), flush=True)

        if len(texto_limpio) < MIN_READABLE_CHARS:
            print("WARNING: low text length", flush=True)

        if confidence < MIN_CONFIDENCE:
            print("WARNING: low confidence", flush=True)

        del img, gray
        gc.collect()

    return texto_documento


# ─────────────────────────────
# UPLOAD ROUTE
# ─────────────────────────────
@app.route('/upload', methods=['POST'])
def upload():

    print("================================", flush=True)
    print("UPLOAD RECIBIDO", flush=True)
    print("================================", flush=True)

    try:

        deed_file = request.files.get("deed")
        excerpt_file = request.files.get("excerpt")
        dui_file = request.files.get("dui")

        print("DEED:", deed_file, flush=True)
        print("EXCERPT:", excerpt_file, flush=True)
        print("DUI:", dui_file, flush=True)

        deed_text = process_file(deed_file)
        excerpt_text = process_file(excerpt_file)
        dui_text = process_file(dui_file)

        return jsonify({
            "success": True,
            "deedText": deed_text,
            "excerptText": excerpt_text,
            "duiText": dui_text
        })

    except Exception as e:
        print("UPLOAD ERROR:", str(e), flush=True)
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)