from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'sierra-leone-seed-tracker-secret-key-2026')
ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    full_name: str
    role: str  # farmer, distributor, regulator, researcher
    phone: Optional[str] = None
    organization: Optional[str] = None
    region: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    region: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Seed(BaseModel):
    model_config = ConfigDict(extra="ignore")
    seed_id: str
    name: str
    variety: str
    crop_type: str  # rice, maize, cassava, etc.
    region: str
    distributor: str
    distributor_contact: Optional[str] = None
    stock_quantity: int
    unit: str  # kg, bags, etc.
    price_per_unit: Optional[float] = None
    status: str  # available, low_stock, out_of_stock
    certification_status: str  # pending, approved, certified
    quality_grade: Optional[str] = None
    planting_season: Optional[str] = None
    maturity_days: Optional[int] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SeedCreate(BaseModel):
    name: str
    variety: str
    crop_type: str
    region: str
    distributor: str
    distributor_contact: Optional[str] = None
    stock_quantity: int
    unit: str = "kg"
    price_per_unit: Optional[float] = None
    quality_grade: Optional[str] = None
    planting_season: Optional[str] = None
    maturity_days: Optional[int] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    registration_id: str
    applicant_name: str
    applicant_email: EmailStr
    applicant_type: str  # producer, distributor, certifier
    organization: str
    phone: str
    region: str
    seed_variety: Optional[str] = None
    documents_submitted: List[str] = []
    status: str  # pending, under_review, approved, rejected
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_at: Optional[datetime] = None
    notes: Optional[str] = None

class RegistrationCreate(BaseModel):
    applicant_name: str
    applicant_email: EmailStr
    applicant_type: str
    organization: str
    phone: str
    region: str
    seed_variety: Optional[str] = None
    documents_submitted: List[str] = []

class Analytics(BaseModel):
    total_seeds: int
    total_distributors: int
    total_regions: int
    total_registrations: int
    seeds_by_crop: dict
    seeds_by_region: dict
    seeds_by_status: dict

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return User(**user)

# Auth routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(user_data.password)
    user_dict = user_data.model_dump(exclude={"password"})
    user_obj = User(**user_dict)
    
    doc = user_obj.model_dump()
    doc['password'] = hashed_pwd
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    access_token = create_access_token({"sub": user_obj.email})
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_data = {k: v for k, v in user.items() if k not in ["_id", "password"]}
    if isinstance(user_data.get('created_at'), str):
        user_data['created_at'] = datetime.fromisoformat(user_data['created_at'])
    
    user_obj = User(**user_data)
    access_token = create_access_token({"sub": user_obj.email})
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Seed routes
@api_router.post("/seeds", response_model=Seed)
async def create_seed(seed_data: SeedCreate, current_user: User = Depends(get_current_user)):
    import uuid
    seed_dict = seed_data.model_dump()
    seed_dict['seed_id'] = str(uuid.uuid4())
    seed_dict['status'] = 'available' if seed_dict['stock_quantity'] > 10 else 'low_stock'
    seed_dict['certification_status'] = 'pending'
    
    seed_obj = Seed(**seed_dict)
    doc = seed_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.seeds.insert_one(doc)
    return seed_obj

@api_router.get("/seeds", response_model=List[Seed])
async def get_seeds(
    crop_type: Optional[str] = None,
    region: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    if crop_type:
        query['crop_type'] = crop_type
    if region:
        query['region'] = region
    if status:
        query['status'] = status
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'variety': {'$regex': search, '$options': 'i'}},
            {'distributor': {'$regex': search, '$options': 'i'}}
        ]
    
    seeds = await db.seeds.find(query, {"_id": 0}).to_list(1000)
    
    for seed in seeds:
        if isinstance(seed.get('created_at'), str):
            seed['created_at'] = datetime.fromisoformat(seed['created_at'])
        if isinstance(seed.get('updated_at'), str):
            seed['updated_at'] = datetime.fromisoformat(seed['updated_at'])
    
    return seeds

@api_router.get("/seeds/{seed_id}", response_model=Seed)
async def get_seed(seed_id: str):
    seed = await db.seeds.find_one({"seed_id": seed_id}, {"_id": 0})
    if not seed:
        raise HTTPException(status_code=404, detail="Seed not found")
    
    if isinstance(seed.get('created_at'), str):
        seed['created_at'] = datetime.fromisoformat(seed['created_at'])
    if isinstance(seed.get('updated_at'), str):
        seed['updated_at'] = datetime.fromisoformat(seed['updated_at'])
    
    return Seed(**seed)

@api_router.put("/seeds/{seed_id}", response_model=Seed)
async def update_seed(seed_id: str, seed_data: dict, current_user: User = Depends(get_current_user)):
    seed_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.seeds.update_one(
        {"seed_id": seed_id},
        {"$set": seed_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Seed not found")
    
    updated_seed = await db.seeds.find_one({"seed_id": seed_id}, {"_id": 0})
    if isinstance(updated_seed.get('created_at'), str):
        updated_seed['created_at'] = datetime.fromisoformat(updated_seed['created_at'])
    if isinstance(updated_seed.get('updated_at'), str):
        updated_seed['updated_at'] = datetime.fromisoformat(updated_seed['updated_at'])
    
    return Seed(**updated_seed)

# Registration routes
@api_router.post("/registrations", response_model=Registration)
async def create_registration(reg_data: RegistrationCreate):
    import uuid
    reg_dict = reg_data.model_dump()
    reg_dict['registration_id'] = str(uuid.uuid4())
    reg_dict['status'] = 'pending'
    
    reg_obj = Registration(**reg_dict)
    doc = reg_obj.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    await db.registrations.insert_one(doc)
    return reg_obj

@api_router.get("/registrations", response_model=List[Registration])
async def get_registrations(current_user: User = Depends(get_current_user)):
    registrations = await db.registrations.find({}, {"_id": 0}).to_list(1000)
    
    for reg in registrations:
        if isinstance(reg.get('submitted_at'), str):
            reg['submitted_at'] = datetime.fromisoformat(reg['submitted_at'])
        if reg.get('reviewed_at') and isinstance(reg['reviewed_at'], str):
            reg['reviewed_at'] = datetime.fromisoformat(reg['reviewed_at'])
    
    return registrations

# Analytics routes
@api_router.get("/analytics", response_model=Analytics)
async def get_analytics():
    total_seeds = await db.seeds.count_documents({})
    total_registrations = await db.registrations.count_documents({})
    
    # Get unique distributors and regions
    distributors = await db.seeds.distinct("distributor")
    regions = await db.seeds.distinct("region")
    
    # Seeds by crop type
    pipeline_crop = [
        {"$group": {"_id": "$crop_type", "count": {"$sum": 1}}}
    ]
    seeds_by_crop_result = await db.seeds.aggregate(pipeline_crop).to_list(100)
    seeds_by_crop = {item["_id"]: item["count"] for item in seeds_by_crop_result}
    
    # Seeds by region
    pipeline_region = [
        {"$group": {"_id": "$region", "count": {"$sum": 1}}}
    ]
    seeds_by_region_result = await db.seeds.aggregate(pipeline_region).to_list(100)
    seeds_by_region = {item["_id"]: item["count"] for item in seeds_by_region_result}
    
    # Seeds by status
    pipeline_status = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    seeds_by_status_result = await db.seeds.aggregate(pipeline_status).to_list(100)
    seeds_by_status = {item["_id"]: item["count"] for item in seeds_by_status_result}
    
    return Analytics(
        total_seeds=total_seeds,
        total_distributors=len(distributors),
        total_regions=len(regions),
        total_registrations=total_registrations,
        seeds_by_crop=seeds_by_crop,
        seeds_by_region=seeds_by_region,
        seeds_by_status=seeds_by_status
    )

# Regions data
@api_router.get("/regions")
async def get_regions():
    return {
        "regions": [
            "Eastern Province",
            "Northern Province",
            "North West Province",
            "Southern Province",
            "Western Area"
        ]
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
