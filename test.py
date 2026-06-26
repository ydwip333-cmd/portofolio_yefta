from dotenv import load_dotenv
import os
import pymysql

load_dotenv()

try:
    conn = pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl={"ssl": {}}
    )

    print("Koneksi berhasil!")

except Exception as e:
    print("Koneksi gagal!")
    print(e)