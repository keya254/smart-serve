from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
import uuid
import datetime

def get_menu_items(db: Session):
    return db.query(models.MenuItem).all()

def create_menu_item(db: Session, item: schemas.MenuItemCreate):
    db_item = models.MenuItem(
        id=str(uuid.uuid4()),
        name=item.name,
        description=item.description,
        price=item.price,
        category=item.category,
        image=item.image,
        popular=item.popular,
        available=item.available
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_categories(db: Session):
    return db.query(models.Category).all()

def get_tables(db: Session):
    return db.query(models.Table).all()

def create_table(db: Session, table: schemas.TableCreate):
    db_table = models.Table(
        id=f"t{table.number}",
        number=table.number,
        seats=table.seats,
        status="available"
    )
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

def update_table(db: Session, table_id: str, updates: schemas.TableUpdate):
    db_table = db.query(models.Table).filter(models.Table.id == table_id).first()
    if not db_table:
        return None
    
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_table, key, value)
    
    db.commit()
    db.refresh(db_table)
    return db_table

def get_orders(db: Session):
    orders = db.query(models.Order).all()
    # Need to map to response format manually or via schema
    return orders

def create_order(db: Session, order: schemas.OrderCreate):
    # Get table info
    table = db.query(models.Table).filter(models.Table.id == order.tableId).first()
    if not table:
        return None
    
    total_amount = sum(item.price * item.quantity for item in order.items)
    created_at = datetime.datetime.now().isoformat()
    
    db_order = models.Order(
        id=str(uuid.uuid4()),
        table_id=order.tableId,
        table_number=table.number,
        status="pending",
        priority=order.priority,
        created_at=created_at,
        payment_status="unpaid",
        total_amount=total_amount,
        paid_amount=0
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order) # Get ID
    
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            menu_item_id=item.id,
            menu_item_name=item.name,
            quantity=item.quantity,
            notes=item.notes,
            status="pending"
        )
        db.add(db_item)
    
    # Update table status
    table.status = "occupied"
    table.last_activity = "Just now"
    
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: str, status: str):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = status
        db.commit()
        return True
    return False

def update_order_item_status(db: Session, item_id: int, status: str):
    item = db.query(models.OrderItem).filter(models.OrderItem.id == item_id).first()
    if item:
        item.status = status
        db.commit()
        return True
    return False

def get_staff(db: Session):
    return db.query(models.Staff).all()

def create_staff(db: Session, staff: schemas.StaffCreate):
    db_staff = models.Staff(
        id=str(uuid.uuid4()),
        name=staff.name,
        role=staff.role,
        code=staff.code,
        active=staff.active
    )
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

def delete_staff(db: Session, staff_id: str):
    db.query(models.Staff).filter(models.Staff.id == staff_id).delete()
    db.commit()
    return True

# Seeding function
def seed_db(db: Session):
    if db.query(models.Category).count() == 0:
        print("Seeding database...")
        categories = ["Starters", "Mains", "Grills", "Sides", "Beverages", "Desserts"]
        for cat in categories:
            db.add(models.Category(name=cat))
        
        # Menu Items (Replicating subset for brevity, user can expand)
        menu_items_data = [
            {"id": "1", "name": "Spiced Chicken Wings", "description": "Crispy wings with our signature peri-peri glaze", "price": 650, "category": "Starters", "popular": True, "available": True, "image": "https://images.unsplash.com/photo-1527477396000-64ca9c0016cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
            {"id": "4", "name": "Nyama Choma Platter", "description": "Grilled goat ribs with kachumbari and ugali", "price": 1800, "category": "Mains", "popular": True, "available": True, "image": "https://images.unsplash.com/photo-1544025162-d76690b67f14?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
             {"id": "12", "name": "Tusker Lager", "description": "500ml cold draft", "price": 350, "category": "Beverages", "popular": True, "available": True, "image": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
        ]
        for item in menu_items_data:
            db.add(models.MenuItem(**item))

        # Tables
        tables_data = [
            {"id": "t1", "number": 1, "seats": 4, "status": "occupied"},
            {"id": "t2", "number": 2, "seats": 2, "status": "available"},
             {"id": "t3", "number": 3, "seats": 6, "status": "available"},
        ]
        for table in tables_data:
             db.add(models.Table(**table))

        db.commit()
        print("Seeded.")
