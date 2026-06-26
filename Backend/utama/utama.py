from flask import Blueprint, request, jsonify
from model import Database
from config import Config
import logging
import re
import resend

logger = logging.getLogger(__name__)
utama_bp = Blueprint('utama', __name__)

resend.api_key = Config.RESEND_API_KEY


def is_valid_email(email: str) -> bool:
    return bool(re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email))


def get_admin_email() -> str | None:
    try:
        db = Database()
        result = db.execute_query(
            """
            SELECT p.email FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin' LIMIT 1
            """,
            fetch=True
        )
        if result and result[0].get('email'):
            return result[0]['email']
    except Exception as e:
        logger.warning(f"[CONTACT] Gagal ambil email admin: {e}")
    return None


@utama_bp.route('/main-profile', methods=['GET'])
def get_main_profile():
    try:
        db = Database()

        profile_result = db.execute_query(
            """
            SELECT p.*, u.username, u.id as user_id
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE u.role = 'admin' LIMIT 1
            """,
            fetch=True
        )

        if not profile_result:
            return jsonify({'success': False, 'error': 'Profil belum tersedia'}), 404

        profile  = profile_result[0]
        admin_id = profile['user_id']

        skills = db.execute_query(
            "SELECT id, nama_skill, icon_class FROM skills WHERE user_id = %s ORDER BY id ASC",
            (admin_id,), fetch=True
        ) or []

        experiences = db.execute_query(
            """
            SELECT id, posisi, perusahaan, durasi, deskripsi
            FROM experiences WHERE user_id = %s ORDER BY created_at DESC
            """,
            (admin_id,), fetch=True
        ) or []

        projects = db.execute_query(
            """
            SELECT id, judul, deskripsi, gambar_url, link_project
            FROM projects WHERE user_id = %s ORDER BY created_at DESC
            """,
            (admin_id,), fetch=True
        ) or []

        data = dict(profile)
        data['skills']      = skills
        data['experiences'] = experiences
        data['projects']    = projects
        data.pop('user_id', None)

        return jsonify({'success': True, 'data': data}), 200

    except Exception as e:
        logger.error(f"[UTAMA ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500


@utama_bp.route('/contact', methods=['POST'])
def send_contact():
    """
    Kirim pesan kontak via Resend.

    Karena Resend free plan hanya bisa kirim ke email yang diverifikasi,
    semua email (from & to) menggunakan email ADMIN sendiri.
    Email dan nama pengirim disisipkan di dalam body pesan + reply_to,
    sehingga admin bisa langsung Reply di inbox untuk membalas pengirim.
    """
    try:
        body = request.get_json()
        if not body:
            return jsonify({'error': 'Request body tidak valid'}), 400

        name    = body.get('name',    '').strip()
        email   = body.get('email',   '').strip()
        message = body.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'error': 'Semua field wajib diisi'}), 400
        if len(name) > 100:
            return jsonify({'error': 'Nama terlalu panjang (maks 100 karakter)'}), 400
        if not is_valid_email(email):
            return jsonify({'error': 'Format email tidak valid'}), 400
        if len(message) > 2000:
            return jsonify({'error': 'Pesan terlalu panjang (maks 2000 karakter)'}), 400

        admin_email = get_admin_email() or Config.ADMIN_EMAIL_FALLBACK
        if not admin_email:
            logger.error("[CONTACT] Tidak ada email admin yang tersedia.")
            return jsonify({'error': 'Konfigurasi email tujuan belum diatur'}), 500

        resend.Emails.send({
            "from":     f"Portofolio Contact <onboarding@resend.dev>",
            "to":       [admin_email],
            "reply_to": email,
            "subject":  f"[Portofolio] Pesan baru dari {name}",
            "html": f"""
                <div style="font-family:sans-serif;max-width:560px;margin:auto;
                            padding:2rem;border:1px solid #e2e8f0;border-radius:12px;">
                  <h2 style="color:#1e40af;margin:0 0 0.5rem;">📬 Pesan Baru dari Portofolio</h2>
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:1rem 0;" />

                  <table style="font-size:0.9rem;color:#334155;width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:6px 0;font-weight:700;width:80px;">Nama</td>
                      <td style="padding:6px 0;">{name}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-weight:700;">Email</td>
                      <td style="padding:6px 0;">
                        <a href="mailto:{email}" style="color:#2563eb;">{email}</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:1.25rem 0 0.5rem;font-weight:700;color:#334155;">Pesan:</p>
                  <div style="background:#f8fafc;padding:1rem;border-radius:8px;
                              border-left:4px solid #2563eb;color:#334155;
                              white-space:pre-wrap;font-size:0.9rem;">{message}</div>

                  <div style="margin-top:1.5rem;padding:0.75rem 1rem;background:#eff6ff;
                              border-radius:8px;font-size:0.82rem;color:#1e40af;">
                    💡 Klik <strong>Reply</strong> di email ini untuk langsung membalas ke <strong>{email}</strong>
                  </div>

                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0;" />
                  <p style="color:#94a3b8;font-size:0.75rem;">
                    Dikirim otomatis dari form kontak portofolio Anda.
                  </p>
                </div>
            """
        })

        logger.info(f"[CONTACT] Pesan dari {name} <{email}> berhasil dikirim ke admin.")

        return jsonify({
            'success': True,
            'message': 'Pesan berhasil dikirim! Terima kasih telah menghubungi saya.'
        }), 200

    except resend.exceptions.ResendError as e:
        logger.error(f"[CONTACT] Resend error: {str(e)}")
        return jsonify({'error': 'Gagal mengirim email. Coba beberapa saat lagi.'}), 502

    except Exception as e:
        logger.error(f"[CONTACT] Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
