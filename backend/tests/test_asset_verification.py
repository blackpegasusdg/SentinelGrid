
import pytest
from types import SimpleNamespace
from fastapi import HTTPException

from app.api.asset import verify_asset_ownership


# Simulated database query
class FakeQuery:

    def __init__(self, asset):
        self.asset = asset

    def filter(self, *args):
        return self

    def first(self):
        return self.asset


# Simulated database session
class FakeDatabase:

    def __init__(self, asset):
        self.asset = asset

    def query(self, model):
        return FakeQuery(self.asset)

    def commit(self):
        pass

    def refresh(self, asset):
        pass


# Simulated DNS response
class FakeDNSAnswer:

    def __init__(self, token):
        self.strings = [token.encode("utf-8")]


# Test successful ownership verification
def test_successful_dns_verification(monkeypatch):

    token = "sentinelgrid-verification=test-token-123"

    asset = SimpleNamespace(
        id=2,
        asset_type="domain",
        value="demo.example.com",
        verification_token=token,
        verified_at=None
    )

    user = SimpleNamespace(
        id=1,
        tenant_id=3
    )

    fake_db = FakeDatabase(asset)

    # Simulate DNS returning the correct TXT record
    def fake_dns_resolve(record_name, record_type):
        assert record_name == (
            "_sentinelgrid-verification.demo.example.com"
        )
        assert record_type == "TXT"

        return [FakeDNSAnswer(token)]

    monkeypatch.setattr(
        "app.api.asset.dns.resolver.resolve",
        fake_dns_resolve
    )

    response = verify_asset_ownership(
        asset_id=2,
        db=fake_db,
        current_user=user
    )

    assert response["verified"] is True
    assert asset.verified_at is not None

    print("SUCCESS: Asset ownership verified!")


# Test incorrect DNS token
def test_incorrect_dns_token(monkeypatch):

    token = "sentinelgrid-verification=correct-token"

    asset = SimpleNamespace(
        id=2,
        asset_type="domain",
        value="demo.example.com",
        verification_token=token,
        verified_at=None
    )

    user = SimpleNamespace(
        id=1,
        tenant_id=3
    )

    fake_db = FakeDatabase(asset)

    # Simulate DNS returning an incorrect token
    def fake_dns_resolve(record_name, record_type):
        return [
            FakeDNSAnswer(
                "sentinelgrid-verification=wrong-token"
            )
        ]

    monkeypatch.setattr(
        "app.api.asset.dns.resolver.resolve",
        fake_dns_resolve
    )

    with pytest.raises(HTTPException) as error:

        verify_asset_ownership(
            asset_id=2,
            db=fake_db,
            current_user=user
        )

    assert error.value.status_code == 400
    assert asset.verified_at is None

    print("SUCCESS: Incorrect DNS token rejected!")
