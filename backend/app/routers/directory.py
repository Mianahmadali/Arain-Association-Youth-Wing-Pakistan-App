from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models import (
    DirectoryCreate, DirectoryResponse, DirectoryUpdate, DirectoryFilter, APIResponse, PaginatedResponse,
    FamilyDirectoryCreate, FamilyDirectoryResponse, FamilyDirectoryUpdate, FamilyDirectoryFilter,
    PopulationResponse, CasteStatsResponse, CasteStats
)
from app.database import get_database
from app.auth import get_current_admin_user
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

directory_router = APIRouter()

@directory_router.post("/", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_directory_entry(directory_data: DirectoryCreate):
    db = get_database()
    try:
        directory_data = directory_data.dict()
        directory_data['created_at'] = datetime.utcnow()
        directory_data['updated_at'] = datetime.utcnow()
        result = await db.directory.insert_one(directory_data)
        return APIResponse(success=True, message="Directory entry created", data={"id": str(result.inserted_id)})
    except Exception as e:
        logger.error(f"Error creating directory entry: {e}")
        raise HTTPException(status_code=400, detail="Error creating directory entry")

@directory_router.get("/", response_model=PaginatedResponse, status_code=status.HTTP_200_OK)
async def list_directory_entries(filter: DirectoryFilter = Depends()):
    db = get_database()
    try:
        query = {}
        if filter.city:
            query['city'] = filter.city
        if filter.profession:
            query['profession'] = filter.profession
        if filter.caste:
            query['caste'] = filter.caste
        if filter.province:
            query['province'] = filter.province
        if filter.gender:
            query['gender'] = filter.gender
        if filter.membership_type:
            query['membership_type'] = filter.membership_type

        skip = (filter.page - 1) * filter.limit
        total_entries = await db.directory.count_documents(query)
        entries = await db.directory.find(query).skip(skip).limit(filter.limit).to_list(length=filter.limit)

        # Convert ObjectId to string for JSON serialization
        for entry in entries:
            entry['_id'] = str(entry['_id'])

        return PaginatedResponse(
            success=True,
            message="Directory entries retrieved successfully",
            data=entries,
            total=total_entries,
            page=filter.page,
            limit=filter.limit,
            total_pages=(total_entries // filter.limit) + (1 if total_entries % filter.limit != 0 else 0)
        )
    except Exception as e:
        logger.error(f"Error listing directory entries: {e}")
        raise HTTPException(status_code=400, detail="Error retrieving directory entries")

@directory_router.get("/community_strength", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def get_community_strength():
    """Get total community strength by summing all family_members_count from directory entries."""
    db = get_database()
    try:
        # Use MongoDB aggregation to sum all family_members_count
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_community_strength': {'$sum': '$family_members_count'}
                }
            }
        ]
        
        result = await db.directory.aggregate(pipeline).to_list(length=1)
        
        if result:
            community_strength = result[0]['total_community_strength']
        else:
            community_strength = 0
            
        return APIResponse(
            success=True, 
            message="Community strength calculated successfully", 
            data={"community_strength": community_strength}
        )
        
    except Exception as e:
        logger.error(f"Error calculating community strength: {e}")
        raise HTTPException(status_code=400, detail="Error calculating community strength")

@directory_router.get("/{directory_id}", response_model=DirectoryResponse, status_code=status.HTTP_200_OK)
async def get_directory_entry(directory_id: str):
    db = get_database()
    try:
        entry = await db.directory.find_one({"_id": ObjectId(directory_id)})
        if entry is None:
            raise HTTPException(status_code=404, detail="Directory entry not found")
        return DirectoryResponse(**entry)
    except Exception as e:
        logger.error(f"Error retrieving directory entry with ID {directory_id}: {e}")
        raise HTTPException(status_code=400, detail="Error retrieving directory entry")

@directory_router.put("/{directory_id}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def update_directory_entry(directory_id: str, directory_data: DirectoryUpdate, current_user=Depends(get_current_admin_user)):
    db = get_database()
    try:
        update_data = directory_data.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        result = await db.directory.update_one({"_id": ObjectId(directory_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Directory entry not found")
        return APIResponse(success=True, message="Directory entry updated")
    except Exception as e:
        logger.error(f"Error updating directory entry with ID {directory_id}: {e}")
        raise HTTPException(status_code=400, detail="Error updating directory entry")

@directory_router.delete("/{directory_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def delete_directory_entry(directory_id: str):
    db = get_database()
    try:
        result = await db.directory.delete_one({"_id": ObjectId(directory_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Directory entry not found")
        return APIResponse(success=True, message="Directory entry deleted")
    except Exception as e:
        logger.error(f"Error deleting directory entry with ID {directory_id}: {e}")
        raise HTTPException(status_code=400, detail="Error deleting directory entry")

@directory_router.get("/export/csv", status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def export_directory_to_csv():
    try:
        import pandas as pd
        from fastapi.responses import StreamingResponse

        entries = await get_database().directory.find().to_list(length=10000)
        df = pd.DataFrame(entries)
        csv_data = df.to_csv(index=False)

        response = StreamingResponse(iter([csv_data]), media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=directory_export.csv"

        return response
    except Exception as e:
        logger.error(f"Error exporting directory to CSV: {e}")
        raise HTTPException(status_code=400, detail="Error exporting directory to CSV")

@directory_router.get("/export/pdf", status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def export_directory_to_pdf():
    try:
        from io import BytesIO
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from fastapi.responses import StreamingResponse

        entries = await get_database().directory.find().to_list(length=10000)
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica", 10)

        for i, entry in enumerate(entries):
            y = height - 30 - (i * 12)
            if y < 40:
                p.showPage()
                p.setFont("Helvetica", 10)
                y = height - 30
            p.drawString(30, y, str(entry))

        p.save()
        buffer.seek(0)

        response = StreamingResponse(buffer, media_type="application/pdf")
        response.headers["Content-Disposition"] = "attachment; filename=directory_export.pdf"

        return response
    except Exception as e:
        logger.error(f"Error exporting directory to PDF: {e}")
        raise HTTPException(status_code=400, detail="Error exporting directory to PDF")

@directory_router.get("/count", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def count_directory_entries():
    db = get_database()
    try:
        total = await db.directory.count_documents({})
        return APIResponse(success=True, message="Total directory entries count", data={"total": total})
    except Exception as e:
        logger.error(f"Error counting directory entries: {e}")
        raise HTTPException(status_code=400, detail="Error counting directory entries")


# ============= FAMILY DIRECTORY ENDPOINTS =============

@directory_router.post("/family", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_family_directory_entry(family_data: FamilyDirectoryCreate):
    """Create a new family entry with family members and auto-calculated total_members."""
    db = get_database()
    try:
        # Convert to dict and add timestamps
        family_dict = family_data.dict()
        family_dict['created_at'] = datetime.utcnow()
        family_dict['updated_at'] = datetime.utcnow()
        
        # Auto-calculate total_members from family_members list
        family_dict['total_members'] = len(family_dict['family_members'])
        
        # Insert into family_directory collection
        result = await db.family_directory.insert_one(family_dict)
        
        return APIResponse(
            success=True, 
            message="Family directory entry created successfully", 
            data={
                "id": str(result.inserted_id),
                "total_members": family_dict['total_members']
            }
        )
    except Exception as e:
        logger.error(f"Error creating family directory entry: {e}")
        raise HTTPException(status_code=400, detail="Error creating family directory entry")

@directory_router.get("/family/all", response_model=PaginatedResponse, status_code=status.HTTP_200_OK)
async def list_all_family_directories(filter: FamilyDirectoryFilter = Depends()):
    """List all family directories with their details."""
    db = get_database()
    try:
        # Build query based on filters
        query = {}
        if filter.city:
            query['city'] = {'$regex': filter.city, '$options': 'i'}
        if filter.caste:
            query['caste'] = {'$regex': filter.caste, '$options': 'i'}
        if filter.province:
            query['province'] = {'$regex': filter.province, '$options': 'i'}
        if filter.district:
            query['district'] = {'$regex': filter.district, '$options': 'i'}
        if filter.membership_type:
            query['membership_type'] = filter.membership_type
        if filter.min_members:
            query['total_members'] = {'$gte': filter.min_members}
        if filter.max_members:
            if 'total_members' in query:
                query['total_members']['$lte'] = filter.max_members
            else:
                query['total_members'] = {'$lte': filter.max_members}
        
        # Pagination
        skip = (filter.page - 1) * filter.limit
        total_families = await db.family_directory.count_documents(query)
        
        # Fetch families with projection to exclude large fields if needed
        families = await db.family_directory.find(query).skip(skip).limit(filter.limit).to_list(length=filter.limit)
        
        # Convert ObjectId to string for JSON serialization
        for family in families:
            family['_id'] = str(family['_id'])
        
        return PaginatedResponse(
            success=True,
            message="Family directories retrieved successfully",
            data=families,
            total=total_families,
            page=filter.page,
            limit=filter.limit,
            total_pages=(total_families // filter.limit) + (1 if total_families % filter.limit != 0 else 0)
        )
    except Exception as e:
        logger.error(f"Error listing family directories: {e}")
        raise HTTPException(status_code=400, detail="Error retrieving family directories")

@directory_router.get("/family/total_population", response_model=PopulationResponse, status_code=status.HTTP_200_OK)
async def get_total_population():
    """Get total population by summing all total_members from family directories."""
    db = get_database()
    try:
        # Use MongoDB aggregation to sum all total_members
        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_population': {'$sum': '$total_members'}
                }
            }
        ]
        
        result = await db.family_directory.aggregate(pipeline).to_list(length=1)
        
        if result:
            total_population = result[0]['total_population']
        else:
            total_population = 0
            
        return PopulationResponse(total_population=total_population)
        
    except Exception as e:
        logger.error(f"Error calculating total population: {e}")
        raise HTTPException(status_code=400, detail="Error calculating total population")

@directory_router.get("/family/stats/caste", response_model=CasteStatsResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def get_caste_statistics():
    """Admin-only endpoint to get per-caste statistics."""
    db = get_database()
    try:
        # Aggregation pipeline to get caste statistics
        pipeline = [
            {
                '$group': {
                    '_id': '$caste',
                    'family_count': {'$sum': 1},
                    'total_members': {'$sum': '$total_members'}
                }
            },
            {
                '$sort': {'total_members': -1}
            }
        ]
        
        caste_stats = await db.family_directory.aggregate(pipeline).to_list(length=None)
        
        # Calculate totals and percentages
        total_families = sum(stat['family_count'] for stat in caste_stats)
        total_population = sum(stat['total_members'] for stat in caste_stats)
        
        # Format response with percentages
        stats_data = []
        for stat in caste_stats:
            percentage = (stat['total_members'] / total_population * 100) if total_population > 0 else 0
            stats_data.append(CasteStats(
                caste=stat['_id'],
                family_count=stat['family_count'],
                total_members=stat['total_members'],
                percentage=round(percentage, 2)
            ))
        
        return CasteStatsResponse(
            success=True,
            message="Caste statistics retrieved successfully",
            data=stats_data,
            total_families=total_families,
            total_population=total_population
        )
        
    except Exception as e:
        logger.error(f"Error getting caste statistics: {e}")
        raise HTTPException(status_code=400, detail="Error retrieving caste statistics")

@directory_router.get("/family/{family_id}", response_model=FamilyDirectoryResponse, status_code=status.HTTP_200_OK)
async def get_family_directory_entry(family_id: str):
    """Get a specific family directory entry by ID."""
    db = get_database()
    try:
        family = await db.family_directory.find_one({"_id": ObjectId(family_id)})
        if family is None:
            raise HTTPException(status_code=404, detail="Family directory entry not found")
        return FamilyDirectoryResponse(**family)
    except Exception as e:
        logger.error(f"Error retrieving family directory entry with ID {family_id}: {e}")
        raise HTTPException(status_code=400, detail="Error retrieving family directory entry")

@directory_router.put("/family/{family_id}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def update_family_directory_entry(family_id: str, family_data: FamilyDirectoryUpdate, current_user=Depends(get_current_admin_user)):
    """Update a family directory entry and recalculate total_members if family_members changed."""
    db = get_database()
    try:
        update_data = family_data.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        
        # If family_members is being updated, recalculate total_members
        if 'family_members' in update_data:
            update_data['total_members'] = len(update_data['family_members'])
        
        result = await db.family_directory.update_one(
            {"_id": ObjectId(family_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Family directory entry not found")
            
        return APIResponse(success=True, message="Family directory entry updated successfully")
        
    except Exception as e:
        logger.error(f"Error updating family directory entry with ID {family_id}: {e}")
        raise HTTPException(status_code=400, detail="Error updating family directory entry")

@directory_router.delete("/family/{family_id}", response_model=APIResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def delete_family_directory_entry(family_id: str):
    """Delete a family directory entry (admin only)."""
    db = get_database()
    try:
        result = await db.family_directory.delete_one({"_id": ObjectId(family_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Family directory entry not found")
        return APIResponse(success=True, message="Family directory entry deleted successfully")
    except Exception as e:
        logger.error(f"Error deleting family directory entry with ID {family_id}: {e}")
        raise HTTPException(status_code=400, detail="Error deleting family directory entry")

