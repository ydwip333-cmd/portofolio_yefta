import cloudinary
import cloudinary.uploader
from flask import Blueprint, request, jsonify
from config import Config
from Backend.admin.login import token_required

upload_bp = Blueprint('upload', __name__)

cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET
)

@upload_bp.route('/upload/image', methods=['POST'])
@token_required
def upload_image(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file yang diterima'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nama file tidak boleh kosong'}), 400

    upload_type = request.form.get('type', 'projects')  
    folder = f"portfolio/profile" if upload_type == 'profile' else "portfolio/projects"

    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 800, "height": 800, "crop": "limit", "quality": "auto"}
            ]
        )
        return jsonify({
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id']
        }), 200

    except Exception as e:
        return jsonify({'error': f'Upload gagal: {str(e)}'}), 500
