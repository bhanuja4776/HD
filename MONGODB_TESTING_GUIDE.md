# MongoDB Connection Testing Guide

## 1. Setup Your MongoDB Connection

### Option A: Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and sign in
3. Create a new project (or use existing)
4. Create a new cluster (free tier available)
5. Click **Connect** → **Drivers** → **Node.js**
6. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```
7. Replace `<username>`, `<password>`, and `<database>` with your actual values

### Option B: Using Local MongoDB

If you have MongoDB installed locally:
```
MONGODB_URI=mongodb://localhost:27017/rag_db
```

### Add to `.env` File

Open `.env` in your project and update:
```
MONGODB_URI=your_connection_string_here
```

---

## 2. Test Your MongoDB Connection

### Start Your Server

```bash
npm run server
```

You should see:
```
✅ Connected to MongoDB
RAG server listening on port 5000
```

### Test Endpoint 1: Check Connection

**URL:** `http://localhost:5000/test/check-connection`  
**Method:** GET

```bash
curl http://localhost:5000/test/check-connection
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Connected to MongoDB successfully",
  "database": "rag_db",
  "collection": "documents",
  "timestamp": "2026-04-16T10:30:00.000Z"
}
```

---

## 3. Insert Dummy Data

### Test Endpoint 2: Insert Dummy Records

**URL:** `http://localhost:5000/test/insert-dummy-data`  
**Method:** POST

```bash
curl -X POST http://localhost:5000/test/insert-dummy-data
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Inserted 3 dummy records",
  "insertedIds": {
    "0": "507f1f77bcf86cd799439011",
    "1": "507f1f77bcf86cd799439012",
    "2": "507f1f77bcf86cd799439013"
  },
  "records": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "budget": 5000,
      "category": "Investment",
      "timestamp": "2026-04-16T10:30:00.000Z",
      "createdAt": "2026-04-16T10:30:00.000Z"
    },
    // ... more records
  ]
}
```

**Terminal Output:**
```
✅ Successfully inserted 3 records
Inserted IDs: { '0': 507f1f77bcf86cd799439011, '1': 507f1f77bcf86cd799439012, '2': 507f1f77bcf86cd799439013 }
```

---

## 4. Fetch All Records

### Test Endpoint 3: Get All Records

**URL:** `http://localhost:5000/test/get-all-records`  
**Method:** GET

```bash
curl http://localhost:5000/test/get-all-records
```

**Expected Response:**
```json
{
  "success": true,
  "totalRecords": 3,
  "records": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "budget": 5000,
      "category": "Investment",
      "timestamp": "2026-04-16T10:30:00.000Z",
      "createdAt": "2026-04-16T10:30:00.000Z"
    },
    // ... more records
  ]
}
```

**Terminal Output:**
```
✅ Retrieved 3 records from database
Record 1: { _id: ..., name: 'John Doe', email: 'john@example.com', ... }
Record 2: { _id: ..., name: 'Jane Smith', email: 'jane@example.com', ... }
Record 3: { _id: ..., name: 'Mike Johnson', email: 'mike@example.com', ... }
```

---

## 5. Delete Test Records

### Test Endpoint 4: Delete All Records

**URL:** `http://localhost:5000/test/delete-all-records`  
**Method:** DELETE

```bash
curl -X DELETE http://localhost:5000/test/delete-all-records
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Deleted 3 records",
  "deletedCount": 3
}
```

---

## 6. View Data in MongoDB Compass

### Install MongoDB Compass

1. Download from [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Install on your computer

### Connect to Your Database

1. Open MongoDB Compass
2. Click **New Connection**
3. Paste your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   ```
4. Click **Connect**

### Navigate to Your Data

1. In the left sidebar, click your database name (e.g., `rag_db`)
2. Click your collection name (e.g., `documents`)
3. You'll see all your records displayed in a table format
4. Click on any record to see its full JSON structure

### Example View:
```
Database: rag_db
  └─ Collection: documents
      ├─ Document 1: { _id: ..., name: "John Doe", ... }
      ├─ Document 2: { _id: ..., name: "Jane Smith", ... }
      └─ Document 3: { _id: ..., name: "Mike Johnson", ... }
```

---

## 7. Troubleshooting

### Connection String Issues
- ✅ Make sure your IP is whitelisted in MongoDB Atlas (Network Access)
- ✅ Check that username and password don't contain special characters (URL encode if needed)
- ✅ Verify database name matches your Atlas setup

### "MongoDB connection is not initialized" Error
- Ensure `MONGODB_URI` is set in `.env`
- Restart your server after updating `.env`

### Data Not Appearing in Compass
- Wait a few seconds and refresh
- Check that you're looking at the correct database and collection
- Verify the connection string is correct

### Test Routes Return 500 Error
- Check terminal logs for detailed error messages
- Verify `MONGODB_URI` format is correct
- Try test/check-connection first to isolate connection issues

---

## 8. Quick Command Summary

```bash
# Start server
npm run server

# Test connection
curl http://localhost:5000/test/check-connection

# Insert dummy data
curl -X POST http://localhost:5000/test/insert-dummy-data

# Get all records
curl http://localhost:5000/test/get-all-records

# Delete all records
curl -X DELETE http://localhost:5000/test/delete-all-records
```

---

## 9. Next Steps

Once testing is successful:

1. **Remove test routes** from `ragServer.js` before deployment (or keep them for debugging)
2. **Modify the dummy data** in the insert route to match your actual data schema
3. **Add proper error handling** in your production code
4. **Use environment variables** to switch between test and production databases

---

## Notes

- The test routes insert records into the same collection as your RAG system
- You can modify the dummy data in the `/test/insert-dummy-data` endpoint
- Check terminal console for detailed logs (prefixed with ✅ for success, ❌ for errors)
- All timestamps are stored as ISO strings in MongoDB
