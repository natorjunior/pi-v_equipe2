import pytest
from unittest.mock import MagicMock
from app.src.domain.service.authentication_service import AuthenticationService
from app.src.domain.dto.login_data import LoginData
from fastapi import HTTPException

@pytest.fixture
def auth_service():
    # Mock das dependências
    mock_user_service = MagicMock()
    mock_jwt_service = MagicMock()
    mock_encryption_service = MagicMock()

    # Criação da instância com as dependências mockadas
    auth_service = AuthenticationService(session=None)
    auth_service.user_service = mock_user_service
    auth_service.jwt_service = mock_jwt_service
    auth_service.encryption_service = mock_encryption_service

    return auth_service

def test_authenticate_user_success(auth_service):
    fake_user = MagicMock()
    fake_user.id = 69
    fake_user.pwd = "MentirinhaDaSilva"

    auth_service.user_service.get_user_by_email = MagicMock(return_value=fake_user)
    auth_service.encryption_service.verify_password = MagicMock(return_value=True)
    auth_service.jwt_service.generate_jwt = MagicMock(return_value="jwt.mentirinha")

    login_data = LoginData(email="mentirinha@gmail.com", password="Mentirinha123")
    token = auth_service.authenticate_user(login_data)

    assert token == "jwt.mentirinha"

def test_authenticate_user_invalid_password(auth_service):
    fake_user = MagicMock()
    fake_user.pwd = "MentirinhaErrada"

    auth_service.user_service.get_user_by_email = MagicMock(return_value=fake_user)
    auth_service.encryption_service.verify_password = MagicMock(return_value=False)

    login_data = LoginData(email="mentirinha@gmail.com", password="MentirinhaMaisErrada")

    with pytest.raises(HTTPException) as exc_info:
        auth_service.authenticate_user(login_data)

    assert exc_info.value.status_code == 403

def test_authenticate_user_user_not_found(auth_service):
    auth_service.user_service.get_user_by_email = MagicMock(return_value=None)
    login_data = LoginData(email="mentirinhaInexistente@gmail.com", password="OiNator")

    with pytest.raises(HTTPException) as exc_info:
        auth_service.authenticate_user(login_data)

    assert exc_info.value.status_code == 403
