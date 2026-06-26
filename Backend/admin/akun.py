from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from model import Database
from Backend.admin.login import token_required
import logging

logger = logging.getLogger(__name__)
akun_bp = Blueprint('akun', __name__)


@akun_bp.route('/akun', methods=['GET'])
@token_required
def get_akun(current_user):
    """Ambil data akun sendiri"""
    try:
        db = Database()
        query = "SELECT id, username, role, created_at FROM users WHERE id = %s"
        result = db.execute_query(query, (current_user,), fetch=True)
        if not result:
            return jsonify({'error': 'User tidak ditemukan'}), 404
        return jsonify({'success': True, 'data': result[0]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@akun_bp.route('/akun/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Ganti password"""
    try:
        data = request.get_json()
        old_password = data.get('old_password', '')
        new_password = data.get('new_password', '')

        if not old_password or not new_password:
            return jsonify({'error': 'Password lama dan baru wajib diisi'}), 400

        if len(new_password) < 6:
            return jsonify({'error': 'Password baru minimal 6 karakter'}), 400

        db = Database()
        query = "SELECT password_hash FROM users WHERE id = %s"
        user = db.execute_query(query, (current_user,), fetch=True)

        if not user:
            return jsonify({'error': 'User tidak ditemukan'}), 404

        if not check_password_hash(user[0]['password_hash'], old_password):
            return jsonify({'error': 'Password lama salah'}), 401

        new_hash = generate_password_hash(new_password)
        db.execute_query(
            "UPDATE users SET password_hash = %s WHERE id = %s",
            (new_hash, current_user)
        )
        return jsonify({'success': True, 'message': 'Password berhasil diubah'}), 200

    except Exception as e:
        logger.error(f"[CHANGE_PW ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500
