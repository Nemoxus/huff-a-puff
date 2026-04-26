import pytesseract
from PIL import Image
import re
from datetime import datetime
from dateutil.relativedelta import relativedelta
import io

# Point pytesseract to the installed executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_bytes: bytes) -> str:
    """Reads the image bytes and returns raw text using Tesseract."""
    image = Image.open(io.BytesIO(image_bytes))
    # Convert to grayscale for better OCR accuracy
    image = image.convert('L') 
    raw_text = pytesseract.image_to_string(image)
    return raw_text

def find_dob_and_check_age(text: str) -> dict:
    """Scans text for all dates and uses the oldest one as the DOB."""
    # Find all date strings in the text
    date_pattern = r'\b(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})\b'
    matches = re.findall(date_pattern, text)
    
    if not matches:
        return {"success": False, "message": "No dates found on ID.", "age": None}
    
    parsed_dates = []
    
    # Loop through all found dates and convert them to datetime objects
    for date_str in matches:
        clean_date_str = date_str.replace('/', '-')
        try:
            # Parse assuming DD-MM-YYYY (Standard for Indian IDs)
            parsed_date = datetime.strptime(clean_date_str, '%d-%m-%Y')
            parsed_dates.append(parsed_date)
        except ValueError:
            continue # Skip this string if it fails to parse
            
    if not parsed_dates:
        return {"success": False, "message": "Could not parse the found date formats.", "age": None}

    # THE FIX: Pick the oldest date found. 
    # This automatically ignores Issue Dates or Expiry Dates.
    actual_dob = min(parsed_dates)
    
    # Calculate age
    age = relativedelta(datetime.now(), actual_dob).years
    
    if age >= 18:
        return {"success": True, "message": "Age verified.", "age": age}
    else:
        return {"success": False, "message": "Must be 18+ to enter.", "age": age}