from flask import Blueprint, jsonify, request, current_app
from db import db
import jwt
import pyotp
from datetime import datetime, timedelta

users_collection = db["users"]

user_signin_bp = Blueprint('user_signin', __name__)

@user_signin_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        email = data.get('email')
        token = data.get('token')

        if not email or not token:
            return jsonify({"error": "Both email and token are required."}), 400

        # Find user by email
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or token."}), 401

        # Check if the user has a TOTP secret
        totp_secret = user.get("totp_secret")
        if not totp_secret:
            return jsonify({"error": "TOTP is not configured for this account."}), 401

        # Verify the TOTP token
        totp = pyotp.TOTP(totp_secret)
        if not totp.verify(token):
            return jsonify({"error": "Invalid email or token."}), 401

        # Generate JWT with expiration time
        jwt_exp = datetime.utcnow() + timedelta(hours=24)
        jwt_token = jwt.encode({
            "user_email": email,
            "exp": jwt_exp
        }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")

        return jsonify({
            "message": "Signin successful",
            "token": jwt_token,
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500