import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from app.src.domain.model.checkin import Checkin
from app.src.domain.service.checkin_service import CheckinService

# Variáveis globais
mock_user = {
    "id": 10,
    "name": "Mentirinha da Silva",
    "email": "mentirinha@example.com",
    "avatar": "fotodeJesus.png",
    "motivation": "Mentir melhor",
    "genres": ["Mentiras", "Lies"],
    "created_at": "2023-01-01T00:00:00Z"
}

mock_checkin = Checkin(
    id=1,
    user_id=10,
    title="Estudo de mentira",
    description="Uma grande mentira",
    photo="img.jpg",
    group_id=1,
    created_at=datetime.now(),
    updated_at=datetime.now()
)

mock_group = {
    "id": 1,
    "name": "Grupo da Mentira",
    "description": "Grupo só de histórias inventadas",
    "created_at": "2023-01-01T00:00:00Z"
}

@pytest.fixture
def mock_session():
    return MagicMock()

@pytest.fixture
def checkin_service(mock_session):
    service = CheckinService(mock_session)
    service.checkin_repository = MagicMock()
    service.user_service = MagicMock    ()
    service.group_service = MagicMock()
    return service


def test_get_checkins_by_user_id(checkin_service):
    checkin_service.checkin_repository.get_checkin_by_user_id.return_value = [mock_checkin]
    checkin_service.user_service.get_user_by_id.return_value = mock_user

    result = checkin_service.get_checkins_by_user_id(user_id=10)

    assert result[0].title == "Estudo de mentira"

def test_get_checkins_by_group_id(checkin_service):
    checkin_service.group_service.get_group_by_id.return_value = mock_group
    checkin_service.group_service.get_group_participant_by_user_id_and_group_id.return_value = {"id": 69}
    checkin_service.checkin_repository.get_checkins_by_group_id.return_value = [mock_checkin]
    checkin_service.user_service.get_user_by_id.return_value = mock_user

    result = checkin_service.get_checkins_by_group_id(user_id=10, group_id=1)

    assert len(result) > 0
    assert result[0]["checkin"].title == "Estudo de mentira"

@patch("app.src.domain.service.checkin_service.upload_file_to_minio")
def test_create_checkin(mock_upload, checkin_service):
    mock_upload.return_value = "mentira.jpg"

    checkin_service.checkin_repository.create_checkin.return_value = mock_checkin
    checkin_service.user_service.get_user_by_id.return_value = mock_user

    checkin_data = MagicMock(group_id=1, title="Estudo de mentirinha", description="Uma grande mentira")
    file_mock = MagicMock()

    result = checkin_service.create_checkin(10, checkin_data, file_mock)

    assert result[0].title == "Estudo de mentira"

@patch("app.src.domain.service.checkin_service.upload_file_to_minio")
def test_update_checkin_by_id(mock_upload, checkin_service):
    mock_upload.return_value = "new_photo.jpg"

    checkin_service.checkin_repository.get_checkin_by_id.return_value = mock_checkin
    checkin_changes = MagicMock(checkin_id=1, title="Uma nova mentira", description="Continuo mentindo")
    file_mock = MagicMock()

    checkin_service.update_checkin_by_id(10, checkin_changes, file_mock)

    checkin_service.checkin_repository.update_checkin.assert_called_once_with(checkin_changes, "new_photo.jpg")
    
def test_delete_checkin_by_id(checkin_service):
    mock_checkin = Checkin(id=1, 
                           user_id=10, 
                           title="Estudo de mentira", 
                           description="Uma grande mentira", 
                           photo="img.jpg", 
                           group_id=1)
    
    checkin_service.checkin_repository.get_checkin_by_id(mock_checkin)

    checkin_service.delete_checkin_by_id(user_id = 10, checkin_id = 1)

    checkin_service.checkin_repository.delete_checkin.assert_called_once_with(1)

def test_get_checkins_by_group_id(checkin_service):
    checkin_service.group_service.get_group_by_id.return_value = mock_group
    checkin_service.group_service.get_group_participant_by_user_id_and_group_id.return_value = {"id": 99}
    checkin_service.checkin_repository.get_checkin_by_group_id.return_value = [mock_checkin]
    checkin_service.user_service.get_user_by_id.return_value = mock_user

    result = checkin_service.get_checkins_by_group_id(user_id=10, group_id=1)

    assert len(result) > 0
    assert result[0].title == "Estudo de mentira"

def test_get_group_ranking(checkin_service):
    mock_ranking_row = MagicMock(user_id=10, checkin_count=5)
    checkin_service.checkin_repository.get_ranking_by_group_id.return_value = [mock_ranking_row]
    checkin_service.group_service.get_group_participant_by_user_id_and_group_id.return_value = {"id": 1}
    checkin_service.user_service.get_user_by_id.return_value = mock_user

    result = checkin_service.get_group_ranking(user_id=10, group_id=1)

    assert result[0]["position"] == 1
    assert result[0]["checkin_count"] == 5
    assert result[0]["user"]["name"] == "Mentirinha da Silva"








