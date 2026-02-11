# SmartServe - Restaurant POS Demo

This is a comprehensive Restaurant POS prototype featuring a complete flow for Customers, Waiters, Kitchen Staff, and Admins.

## 🚀 Getting Started

1.  **Start the app:**
    ```bash
    npm run dev
    ```
2.  **Open in Browser:** `http://localhost:8080` (or the port shown in terminal).

## 📱 User Flows

### 1. Customer (QR Code)
*   **Simulated Link:** `http://localhost:8080/menu?tableId=t1` (Simulates scanning Table 1's QR code).
*   **Actions:**
    *   Browse Menu.
    *   Add items to Cart.
    *   **Place Order:** Sends order to Waiter for approval.
    *   **View Status:** See if Kitchen is preparing your food.
    *   **Pay Bill:** Split bill calculator and M-Pesa STK Push simulation.

### 2. Waiter
*   **Login:** Use the "Waiter" quick login button on the Login page.
*   **Dashboard:**
    *   View **Incoming Orders** (Pending Approval).
    *   **Approve/Reject** orders (Approved orders go to Kitchen).
    *   View assigned tables.

### 3. Kitchen (Chef)
*   **Login:** Use the "Kitchen" quick login button.
*   **Display:**
    *   See approved orders.
    *   Update item status: `Pending` -> `Start` -> `Done`.
    *   Mark orders as Ready.

### 4. Admin
*   **Login:** Use the "Admin" quick login button.
*   **Dashboard:**
    *   View Revenue & Active Tables.
    *   **Table Management:** Assign waiters to tables.

## 🛠 Tech Stack
*   **Frontend:** React, TypeScript, Vite.
*   **UI:** Tailwind CSS, Shadcn UI.
*   **State:** React Context (`POSContext`) simulating a backend database.
*   **Persistence:** `localStorage` (Refresh page to reset session, or clear local storage to start fresh).
