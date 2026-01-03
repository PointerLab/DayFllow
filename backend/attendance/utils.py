from datetime import timedelta

def calculate_status(total_hours):
    if total_hours >= 8:
        return "PRESENT"
    elif total_hours >= 4:
        return "HALF_DAY"
    return "ABSENT"
