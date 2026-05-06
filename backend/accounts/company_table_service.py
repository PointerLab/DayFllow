import re
from typing import Optional

from django.db import connection
from django.utils.text import slugify

from .models import CustomUser


def build_company_table_name(company_name: str) -> str:
    normalized = slugify(company_name or "").replace("-", "_")
    normalized = re.sub(r"[^a-zA-Z0-9_]", "", normalized)
    if not normalized:
        normalized = "company"
    return f"company_{normalized}"


def ensure_company_table(company_name: str) -> str:
    table_name = build_company_table_name(company_name)
    quoted_table_name = connection.ops.quote_name(table_name)
    vendor = connection.vendor

    with connection.cursor() as cursor:
        if vendor == "sqlite":
            # SQLite-compatible schema for local fallback DB.
            cursor.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {quoted_table_name} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER UNIQUE NOT NULL,
                    email TEXT NOT NULL,
                    first_name TEXT NOT NULL DEFAULT '',
                    last_name TEXT NOT NULL DEFAULT '',
                    role TEXT NOT NULL,
                    department TEXT NOT NULL DEFAULT '',
                    employment_type TEXT NOT NULL DEFAULT '',
                    date_of_joining DATE NOT NULL,
                    created_by_user_id INTEGER NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        else:
            cursor.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {quoted_table_name} (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT UNIQUE NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    first_name VARCHAR(50) NOT NULL DEFAULT '',
                    last_name VARCHAR(50) NOT NULL DEFAULT '',
                    role VARCHAR(10) NOT NULL,
                    department VARCHAR(100) NOT NULL DEFAULT '',
                    employment_type VARCHAR(50) NOT NULL DEFAULT '',
                    date_of_joining DATE NOT NULL,
                    created_by_user_id BIGINT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS user_id BIGINT
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS email VARCHAR(255)
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) NOT NULL DEFAULT ''
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) NOT NULL DEFAULT ''
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS role VARCHAR(10)
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS department VARCHAR(100) NOT NULL DEFAULT ''
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) NOT NULL DEFAULT ''
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS date_of_joining DATE
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT NULL
                """
            )
            cursor.execute(
                f"""
                ALTER TABLE {quoted_table_name}
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                """
            )
        cursor.execute(
            f"""
            CREATE UNIQUE INDEX IF NOT EXISTS {table_name}_user_id_uq
            ON {quoted_table_name} (user_id)
            """
        )

    return table_name


def insert_company_user_row(
    company_name: str,
    user: CustomUser,
    created_by_user_id: Optional[int] = None,
) -> str:
    table_name = ensure_company_table(company_name)
    quoted_table_name = connection.ops.quote_name(table_name)

    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            INSERT INTO {quoted_table_name}
            (
                user_id,
                email,
                first_name,
                last_name,
                role,
                department,
                employment_type,
                date_of_joining,
                created_by_user_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_id)
            DO UPDATE SET
                email = EXCLUDED.email,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                role = EXCLUDED.role,
                department = EXCLUDED.department,
                employment_type = EXCLUDED.employment_type,
                date_of_joining = EXCLUDED.date_of_joining,
                created_by_user_id = EXCLUDED.created_by_user_id
            """,
            [
                user.id,
                user.email,
                user.first_name or "",
                user.last_name or "",
                user.role,
                user.department or "",
                user.employment_type or "",
                user.date_of_joining,
                created_by_user_id,
            ],
        )

    return table_name
