from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models import DirectoryCreate, DirectoryResponse, DirectoryUpdate, DirectoryFilter, APIResponse, PaginatedResponse
from app.database import get_database
from app.auth import get_current_admin_user
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

directory_router = APIRouter()

db = get_database()

@directory_router.post("/", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_directory_entry(directory_data: DirectoryCreate):
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

@directory_router.get("/{directory_id}", response_model=DirectoryResponse, status_code=status.HTTP_200_OK)
async def get_directory_entry(directory_id: str):
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

        entries = await db.directory.find().to_list(length=10000)
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

        entries = await db.directory.find().to_list(length=10000)
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
    try:
        total = await db.directory.count_documents({})
        return APIResponse(success=True, message="Total directory entries count", data={"total": total})
    except Exception as e:
        logger.error(f"Error counting directory entries: {e}")
        raise HTTPException(status_code=400, detail="Error counting directory entries")

