from datetime import date
from accounts.models import User
import random 
import string

def generate_login_id(first_name, last_name, joining_date):
    prefix = "OI"  # company prefix
    fn = first_name[:2].upper()
    ln = last_name[:2].upper()
    year = joining_date.year

    count = User.objects.filter(date_of_joining__year=year).count() + 1
    serial = str(count).zfill(4)

    return f"{prefix}{fn}{ln}{year}{serial}"

def generate_temp_password():
    return "".join(
        random.choices(string.ascii_letters + string.digits, k=10)
    )
