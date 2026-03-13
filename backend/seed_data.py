import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

async def seed_database():
    # MongoDB connection
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    # Clear existing data
    await db.seeds.delete_many({})
    await db.users.delete_many({})
    await db.registrations.delete_many({})
    
    print("Cleared existing data...")
    
    # Sample seeds data
    seeds = [
        {
            "seed_id": str(uuid.uuid4()),
            "name": "NERICA L-19",
            "variety": "Upland Rice",
            "crop_type": "rice",
            "region": "Eastern Province",
            "distributor": "Sierra Rice Company",
            "distributor_contact": "+232 76 111 111",
            "stock_quantity": 500,
            "unit": "kg",
            "price_per_unit": 25000,
            "status": "available",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "April-June",
            "maturity_days": 90,
            "description": "High-yielding upland rice variety suitable for Sierra Leone",
            "latitude": 8.2,
            "longitude": -10.8,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "ROK 24",
            "variety": "Lowland Rice",
            "crop_type": "rice",
            "region": "Northern Province",
            "distributor": "Northern Seeds Ltd",
            "distributor_contact": "+232 76 222 222",
            "stock_quantity": 750,
            "unit": "kg",
            "price_per_unit": 22000,
            "status": "available",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "May-July",
            "maturity_days": 120,
            "description": "Lowland rice variety with high yield potential",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "SAMMAZ 15",
            "variety": "Yellow Maize",
            "crop_type": "maize",
            "region": "Southern Province",
            "distributor": "Southern Agro Seeds",
            "distributor_contact": "+232 76 333 333",
            "stock_quantity": 350,
            "unit": "kg",
            "price_per_unit": 18000,
            "status": "available",
            "certification_status": "approved",
            "quality_grade": "Grade A",
            "planting_season": "April-June",
            "maturity_days": 95,
            "description": "Drought-tolerant yellow maize variety",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "TMS 30572",
            "variety": "Cassava",
            "crop_type": "cassava",
            "region": "Western Area",
            "distributor": "Western Seeds Hub",
            "distributor_contact": "+232 76 444 444",
            "stock_quantity": 1200,
            "unit": "cuttings",
            "price_per_unit": 500,
            "status": "available",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "March-October",
            "maturity_days": 365,
            "description": "High-yielding cassava variety resistant to diseases",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "ICGV-IS 07222",
            "variety": "Groundnut",
            "crop_type": "groundnut",
            "region": "North West Province",
            "distributor": "NorthWest Agriseeds",
            "distributor_contact": "+232 76 555 555",
            "stock_quantity": 200,
            "unit": "kg",
            "price_per_unit": 30000,
            "status": "low_stock",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "May-July",
            "maturity_days": 110,
            "description": "Early maturing groundnut variety with good oil content",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "SAMSORG 44",
            "variety": "Sorghum",
            "crop_type": "sorghum",
            "region": "Eastern Province",
            "distributor": "Sierra Rice Company",
            "distributor_contact": "+232 76 111 111",
            "stock_quantity": 150,
            "unit": "kg",
            "price_per_unit": 20000,
            "status": "low_stock",
            "certification_status": "approved",
            "quality_grade": "Grade B",
            "planting_season": "April-June",
            "maturity_days": 105,
            "description": "Drought-tolerant sorghum suitable for marginal lands",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "NERICA L-41",
            "variety": "Upland Rice",
            "crop_type": "rice",
            "region": "Southern Province",
            "distributor": "Southern Agro Seeds",
            "distributor_contact": "+232 76 333 333",
            "stock_quantity": 600,
            "unit": "kg",
            "price_per_unit": 26000,
            "status": "available",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "April-June",
            "maturity_days": 95,
            "description": "Short duration upland rice variety",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "seed_id": str(uuid.uuid4()),
            "name": "SAMMAZ 27",
            "variety": "White Maize",
            "crop_type": "maize",
            "region": "Northern Province",
            "distributor": "Northern Seeds Ltd",
            "distributor_contact": "+232 76 222 222",
            "stock_quantity": 400,
            "unit": "kg",
            "price_per_unit": 19000,
            "status": "available",
            "certification_status": "certified",
            "quality_grade": "Grade A",
            "planting_season": "May-July",
            "maturity_days": 100,
            "description": "High-yielding white maize with good storage quality",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.seeds.insert_many(seeds)
    print(f"Inserted {len(seeds)} seeds")
    
    # Sample registrations
    registrations = [
        {
            "registration_id": str(uuid.uuid4()),
            "applicant_name": "Mohamed Kamara",
            "applicant_email": "mohamed@sierraseeds.sl",
            "applicant_type": "producer",
            "organization": "Sierra Rice Company",
            "phone": "+232 76 111 111",
            "region": "Eastern Province",
            "seed_variety": "NERICA L-19",
            "documents_submitted": ["Business License", "Production Certificate"],
            "status": "approved",
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
            "notes": "All documents verified and approved"
        },
        {
            "registration_id": str(uuid.uuid4()),
            "applicant_name": "Fatmata Sesay",
            "applicant_email": "fatmata@northernseeds.sl",
            "applicant_type": "distributor",
            "organization": "Northern Seeds Ltd",
            "phone": "+232 76 222 222",
            "region": "Northern Province",
            "documents_submitted": ["Business Registration", "Tax Clearance"],
            "status": "under_review",
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "notes": "Awaiting field inspection"
        },
        {
            "registration_id": str(uuid.uuid4()),
            "applicant_name": "Ibrahim Conteh",
            "applicant_email": "ibrahim@southernagro.sl",
            "applicant_type": "producer",
            "organization": "Southern Agro Seeds",
            "phone": "+232 76 333 333",
            "region": "Southern Province",
            "seed_variety": "SAMMAZ 15",
            "documents_submitted": ["Business License"],
            "status": "pending",
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "notes": "Pending document submission"
        }
    ]
    
    await db.registrations.insert_many(registrations)
    print(f"Inserted {len(registrations)} registrations")
    
    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
