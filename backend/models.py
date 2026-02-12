from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
import uuid
import datetime

def generate_uuid():
    return str(uuid.uuid4())

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True)

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Integer)  # Storing price as Integer (cents/smallest unit) as per original schema or Float? Original seems to use Integer (e.g. 650)
    category = Column(String)
    image = Column(String)
    popular = Column(Boolean, default=False)
    available = Column(Boolean, default=True)

class Table(Base):
    __tablename__ = "tables"

    id = Column(String, primary_key=True, default=generate_uuid)
    number = Column(Integer, unique=True) # Assuming table numbers are unique
    seats = Column(Integer)
    status = Column(String, default="available") # available, occupied, needs-attention, billing
    session_id = Column(String, nullable=True)
    waiter = Column(String, nullable=True)
    guests = Column(Integer, nullable=True)
    order_total = Column(Integer, nullable=True)
    last_activity = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    table_id = Column(String, ForeignKey("tables.id"))
    table_number = Column(Integer)
    status = Column(String, default="pending") # pending, preparing, ready, served, completed
    priority = Column(String, default="normal") # normal, rush
    created_at = Column(String, default=lambda: datetime.datetime.now().isoformat())
    payment_status = Column(String, default="unpaid")
    total_amount = Column(Integer, default=0)
    paid_amount = Column(Integer, default=0)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String, ForeignKey("orders.id"))
    menu_item_id = Column(String, ForeignKey("menu_items.id"))
    menu_item_name = Column(String)
    quantity = Column(Integer)
    notes = Column(String, nullable=True)
    status = Column(String, default="pending")

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")

class Staff(Base):
    __tablename__ = "staff"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    role = Column(String) # admin, waiter, kitchen
    code = Column(String, unique=True)
    active = Column(Boolean, default=True)
