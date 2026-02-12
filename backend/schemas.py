from typing import List, Optional
from pydantic import BaseModel, Field
import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: int
    category: str
    image: str
    popular: bool = False
    available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: str

    class Config:
        from_attributes = True

class TableBase(BaseModel):
    number: int
    seats: int
    status: Optional[str] = "available"
    session_id: Optional[str] = None
    waiter: Optional[str] = None
    guests: Optional[int] = None
    order_total: Optional[int] = None
    last_activity: Optional[str] = None

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    status: Optional[str] = None
    session_id: Optional[str] = None
    waiter: Optional[str] = None
    guests: Optional[int] = None
    order_total: Optional[int] = None
    last_activity: Optional[str] = None

class Table(TableBase):
    id: str

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    menu_item_id: str
    menu_item_name: str
    quantity: int
    notes: Optional[str] = None
    status: Optional[str] = "pending"

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: str

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    table_id: str
    table_number: int
    status: Optional[str] = "pending"
    priority: Optional[str] = "normal"
    created_at: Optional[str] = None
    payment_status: Optional[str] = "unpaid"
    total_amount: Optional[int] = 0
    paid_amount: Optional[int] = 0

class OrderItemCreateInput(BaseModel):
    id: str # This is menu_item_id
    name: str
    quantity: int
    notes: Optional[str] = None
    price: int

class OrderCreate(BaseModel):
    tableId: str 
    items: List[OrderItemCreateInput] 
    priority: Optional[str] = "normal"

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: str
    name: str = Field(alias="menu_item_name")
    quantity: int
    notes: Optional[str] = None
    status: str
    price: int = 0 

    class Config:
        from_attributes = True
        populate_by_name = True

class OrderResponse(BaseModel):
    id: str
    tableId: str = Field(alias="table_id")
    tableNumber: int = Field(alias="table_number")
    status: str
    priority: str
    createdAt: str = Field(alias="created_at")
    paymentStatus: str = Field(alias="payment_status")
    totalAmount: int = Field(alias="total_amount")
    paidAmount: int = Field(alias="paid_amount")
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
        populate_by_name = True

class StaffBase(BaseModel):
    name: str
    role: str
    code: str
    active: bool = True

class StaffCreate(StaffBase):
    pass

class Staff(StaffBase):
    id: str

    class Config:
        from_attributes = True
