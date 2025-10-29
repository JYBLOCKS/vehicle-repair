from enum import Enum

class EstimateStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    in_progress = "in_progress"
    completed = "completed"
    canceled = "canceled"
