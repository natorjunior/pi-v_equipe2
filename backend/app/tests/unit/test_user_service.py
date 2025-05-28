import json
import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from fastapi import UploadFile
from app.src.domain.service.user_service import UserService
from app.src.domain.dto.user_dto import NewUser, UserUpdate
from app.src.domain.model.group_participant import GroupParticipant
from app.src.domain.model.checkin import Checkin
from app.src.domain.repository.user_repository import UserRepository
from app.src.infra.security.encryption_service import EncryptionService
from app.src.domain.model.user import User

# Mock de uma instância real de User
mock_user = User(
    id=69,
    email="mentirinhas@exemplo.com",
    name="Mentirinha",
    motivation="Vencer",
    genres=json.dumps(["Mentir", "Mentir"]),
    avatar="default_avatar.jpeg",
    created_at=datetime.now()
)

@pytest.fixture
def mock_session():
    return MagicMock()

@pytest.fixture
def user_service(mock_session):
    user_service = UserService(mock_session)
    user_service.user_repository = MagicMock(spec=UserRepository)
    user_service.encryption_service = MagicMock(spec=EncryptionService)
    user_service.validation = MagicMock()
    return user_service

@patch("app.src.domain.dto.user_dto.get_file_from_minio", return_value="fake_url")
def test_get_user_by_id(mock_minio, user_service):
    user_service.user_repository.get_user_by_id.return_value = mock_user

    result = user_service.get_user_by_id(user_id=69)

    assert result.name == "Mentirinha"

@patch("app.src.domain.dto.user_dto.get_file_from_minio", return_value="fake_url")
def test_get_user_by_email(mock_minio, user_service):
    user_service.user_repository.get_user_by_email.return_value = mock_user

    result = user_service.get_user_by_email(user_email="mentirinhas@exemplo.com")

    assert result.email == "mentirinhas@exemplo.com"

@patch("app.src.domain.dto.user_dto.get_file_from_minio", return_value="fake_url")
def test_create_user(mock_minio, user_service):
    user_service.validation.email_validator.return_value = True
    new_user = NewUser(
        name="Nova Mentira",
        email="mentira2@mentir.com",
        motivation="Nada",
        genres=["Nenhum", "Zero"],
        password="senha123"
    )

    user_service.user_repository.create_user.return_value = User(
        id=70,
        email="mentira2@mentir.com",
        name="Nova Mentira",
        motivation="Nada",
        genres=["Nenhum", "Zero"],
        avatar="default_avatar.jpeg"
    )

    result = user_service.create_user(new_user=new_user)

    assert result.email == "mentira2@mentir.com"
    assert result.name == "Nova Mentira"

@patch("app.src.domain.dto.user_dto.get_file_from_minio", return_value="fake_url")
def test_update_user(mock_minio, user_service):
    user_changes = UserUpdate(genres=["Pamonha", "Farinha"])

    user_service.user_repository.get_user_by_id.return_value = mock_user
    user_service.user_repository.update_user.return_value = User(
        id=mock_user.id,
        email=mock_user.email,
        name=mock_user.name,
        motivation=mock_user.motivation,
        genres=json.dumps(user_changes.genres),
        avatar=mock_user.avatar,
        created_at=datetime.now()
    )

    result = user_service.update_user(user_id=69, user_changes=user_changes)

    assert result.genres == user_changes.genres

@patch("app.src.domain.dto.user_dto.get_file_from_minio", return_value="fake_url")
def test_update_user_avatar(mock_minio, user_service):
    mock_file = MagicMock(spec=UploadFile)
    mock_file.filename = "new_avatar.jpeg"
    mock_file.content_type = "image/jpeg"
    mock_file.file = MagicMock()

    mock_user = User(
        id=69,
        email="mentirinhas@exemplo.com",
        name="Mentirinha",
        motivation="Vencer",
        genres=json.dumps(["Mentir", "Mentir"]),
        avatar="default_avatar.jpeg",
        created_at=datetime.now()
    )

    with patch("app.src.adapter.minio_adapter.upload_file_to_minio", return_value="new_avatar_url"):
        mock_user.avatar = "new_avatar_url"
        user_service.user_repository.set_user_avatar.return_value = mock_user

        result = user_service.update_user_avatar(user_id=69, avatar=mock_file)

    assert result.avatar == "fake_url"

def test_delete_user(user_service):
    user_service.user_repository.get_user_by_id.return_value = mock_user
    user_service.user_repository.delete_user.return_value = None

    result = user_service.delete_user(user_id=69)

    assert result == {'detail': 'Usuário deletado com sucesso'}
