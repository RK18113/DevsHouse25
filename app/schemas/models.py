from pydantic import BaseModel
from typing import Optional, List

class PredictInput(BaseModel):
    feature1: float
    feature2: float
    feature3: float

class Asset(BaseModel):
    name: str
    symbol: str
    value: float
    percentage: float

class Watchlist(BaseModel):
    symbols: List[str]

class Profile(BaseModel):
    full_name: str
    email: str
    location: str
    occupation: str
    risk_tolerance: str
    investment_horizon: str
    monthly_investment: float
    preferred_sectors: List[str]
    investment_goals: List[str]
    assets: Optional[List[Asset]] = []
    watchlist: Optional[Watchlist] = None

class GraphData(BaseModel):
    labels: List[str]
    actual: List[float]
    predicted: List[float]

class Settings(BaseModel):
    email: str
    dark_mode: bool
    notifications: Optional[bool] = True

class User(BaseModel):
    username: str
    hashed_password: str
    profile: Optional[Profile] = None
    assets: Optional[List[Asset]] = []
    watchlist: Optional[Watchlist] = None
    graph: Optional[GraphData] = None
    settings: Optional[Settings] = None
