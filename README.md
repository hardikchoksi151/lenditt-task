# Contact Management API

This API allows users to manage contacts. Contacts' numbers are encrypted before being stored in the database, ensuring data security.

## Prerequisites

- Node.js
- MySQL

## Setting up the Environment Variables

Before running the API, you need to set up your environment variables. These variables are used to configure your server and database connections.

1. Fill in the environment variables in `.env`:

```plaintext
PORT=your_server_port
NODE_ENV="development"
DB_PORT=your_database_port (3306 for mysql)
DB_NAME="task"
DB_USER="your_database_user"
DB_PASSWORD="your_database_user_password"
DB_HOST="your_database_host"
DB_DIALECT="mysql"
ENC_SECRET="lenditt"
HMAC_SECRET="lenditt"
```
## Database Setup

1. Create mysql database named `task`.

```sql
CREATE DATABASE task;
```
2. Update the database configuration in the `.env` file.

## Installing Dependencies

Now, Run the following command to install the necessary packages:

```bash
npm install
```

## Running Migrations

Now, Run the following command to run the migration scripts:

```bash
npm run migrate
```

The migration scripts creates:

- `Users` table.
- `Contacts` table.

You can also undo all migrations using following command (Just an option, no need to do this):

```bash
npm run migrate:undo
```

## Running the API

To start the API, use:

```bash
npm start
```


## API Reference

#### API - 1:  Sync Contacts

```http
  POST /api/sync-contacts
```

Example 1: 

Request body:

```json
 {
    "userId": 1,
    "Contacts": [
      { "name": "rahil", "number": "1234567890" },
      { "name": "sahil", "number": "2234567777" },
      { "name": "miten", "number": "1212123456" }
    ]
  }
```

Response:

```json
{
    "success": true,
    "message": "Data saved successfully"
}

Example 2: 

Request body:

```json
 {
    "userId": 2,
    "Contacts": [
      { "name": "darshan", "number": "6657991246" },
      { "name": "sahil", "number": "2234567777" }
    ]
 }
```

Response:

```json
{
    "success": true,
    "message": "Data saved successfully"
}
```

Here If you provide duplicate number again in the same userId's contacts, it will respond with `500 Internal Server Error`.

Example 3:

Request body:

```json
 {
    "userId": 1,
    "Contacts": [
      { "name": "rahil", "number": "1234567890" }
    ]
 }
```

Response:

```json
{
    "success": false,
    "message": "Validation error"
}
```

But with same userId, but new number will add that number in that user's contact list.

Example 3:

Request body:

```json
 {
    "userId": 1,
    "Contacts": [
      { "name": "hardik", "number": "1111111111" }
    ]
  }
```

Response:
```json
{
    "success": true,
    "message": "Data saved successfully"
}
```

It will respond with `400 Bad Request` if userId or Contacts array is not provided in request body.

Example 4:

Request body:

```json
{
    "userId": 1
}
```

Response:

```json
{
    "success": false,
    "message": "Invalid Input"
}
```

#### API 2: Find common user for a particular number

```http
  GET /api/common-users?searchNumber=${phoneNumber}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `searchNumber`      | `string` | **Required**. Phone number |

for a valid 10-digit phone number `(e.g. 2234567777)`, the api should respond with:

Example 1:

```http
GET /api/common-users?searchNumber=2234567777
```
Response:

```json
{
    "Name": "sahil",
    "commonUsers": [
        1,
        2
    ]
}
```
Example 2:

If the `searchNumber` is not `10` characters long or searchNumber is given at all, the api will respond with `400 Bad Request`.

Response:

```json
{
    "success": false,
    "message": "Please provide a valid phoneNumber"
}
```

#### API 3: Get contacts by user_id with pagination and search

```http
GET /api/get-contacts?searchText=${name}&userId=${userId}&page=${pageNumber}&pageSize=${pageSize}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `INTEGER` | **Required**. User ID |
| `page` | `INTEGER` | current page number (default 1) |
| `pageSize` | `INTEGER` | number of records in each page (default 2) |
| `searchText` | `STRING` | **Optional**. Name to be searched |

The `searchText` parameter is optional, if not provided, the api will return all the records of provided `userId`. (paginated).

The default page size is `2` records per page and default current page is `1st` page.

Example 1:

Request:

```http
GET /api/get-contacts?userId=1&page=1&pageSize=2
```
Response:

```json
{
    "totalCount": 4,
    "rows": [
        {
            "number": "1212123456",
            "name": "miten"
        },
        {
            "number": "1111111111",
            "name": "hardik"
        }
    ]
}
```

If `searchText` is provided, then it will match `searchText` with `name` for provided `userId` and return matched records.

Example 2:

Request:

```http
GET /api/get-contacts?searchText=rah&userId=1&page=1&pageSize=2
```

Response: 

```json
{
    "totalCount": 1,
    "rows": [
        {
            "number": "1234567890",
            "name": "rahil"
        }
    ]
}
```

`userId` is required parameter, if not provided, api will respond with `400 Bad Request`.

Example 3:

Request:

```http
GET /api/get-contacts?searchText=rah&page=1&pageSize=2
```

Response: 

```json
{
    "status": false,
    "message": "Please provide a user id"
}
```