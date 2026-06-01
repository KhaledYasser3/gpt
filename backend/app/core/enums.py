import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class AdminUserAction(str, enum.Enum):
    CREATE = "create"
    DELETE = "delete"
    RENEW = "renew"
    ADD_TOKENS = "add_tokens"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
