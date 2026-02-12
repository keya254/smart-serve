from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import socketio
from typing import List

import models, schemas, crud, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        # Seed on first run
        crud.seed_db(db)
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SmartServe Backend is running"}

# --- Menu Items ---
@app.get("/api/menu-items", response_model=List[schemas.MenuItem])
def read_menu_items(db: Session = Depends(get_db)):
    return crud.get_menu_items(db)

@app.post("/api/menu-items", response_model=schemas.MenuItem, status_code=status.HTTP_201_CREATED)
async def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    db_item = crud.create_menu_item(db, item)
    await sio.emit('menu_updated')
    return db_item

# --- Categories ---
@app.get("/api/categories", response_model=List[str])
def read_categories(db: Session = Depends(get_db)):
    categories = crud.get_categories(db)
    return [c.name for c in categories]

# --- Tables ---
@app.get("/api/tables", response_model=List[schemas.Table])
def read_tables(db: Session = Depends(get_db)):
    return crud.get_tables(db)

@app.post("/api/tables", response_model=schemas.Table, status_code=status.HTTP_201_CREATED)
async def create_table(table: schemas.TableCreate, db: Session = Depends(get_db)):
    db_table = crud.create_table(db, table)
    await sio.emit('tables_updated')
    return db_table

@app.put("/api/tables/{id}")
async def update_table(id: str, updates: schemas.TableUpdate, db: Session = Depends(get_db)):
    db_table = crud.update_table(db, id, updates)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    await sio.emit('tables_updated')
    return {"success": True}

# --- Orders ---
@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    # Manual mapping might be needed if complex relationships aren't handled automatically by Pydantic's orm_mode for deep nesting
    # But let's try relying on response_model
    orders = crud.get_orders(db)
    return orders

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        db_order = crud.create_order(db, order)
        if not db_order:
             raise HTTPException(status_code=404, detail="Table not found")
        
        await sio.emit('orders_updated')
        await sio.emit('tables_updated')
        return db_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/orders/{id}/status")
async def update_order_status(id: str, status_update: dict, db: Session = Depends(get_db)):
    status_val = status_update.get("status")
    if not status_val:
         raise HTTPException(status_code=400, detail="Status required")
    
    success = crud.update_order_status(db, id, status_val)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    
    await sio.emit('orders_updated')
    return {"success": True}

@app.put("/api/order-items/{id}/status")
async def update_order_item_status(id: int, status_update: dict, db: Session = Depends(get_db)):
    status_val = status_update.get("status")
    if not status_val:
         raise HTTPException(status_code=400, detail="Status required")

    success = crud.update_order_item_status(db, id, status_val)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")

    await sio.emit('orders_updated')
    return {"success": True}

# --- Staff ---
@app.get("/api/staff", response_model=List[schemas.Staff])
def read_staff(db: Session = Depends(get_db)):
    return crud.get_staff(db)

@app.post("/api/staff", response_model=schemas.Staff, status_code=status.HTTP_201_CREATED)
def create_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    return crud.create_staff(db, staff)

@app.delete("/api/staff/{id}")
def delete_staff(id: str, db: Session = Depends(get_db)):
    crud.delete_staff(db, id)
    return {"success": True}

@sio.event
async def connect(sid, environ):
    print("connect ", sid)

@sio.event
async def disconnect(sid):
    print("disconnect ", sid)

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="0.0.0.0", port=8000, reload=True)
