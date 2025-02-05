-- node v 18.18.0

## How to run

npx prisma db push
npm run dev

## route yang ada

POST /api/auth/register --> register
POST /api/auth/login -->login

GET /api/user/checklist?page=[page]&pageSize[pageSize] -->get data list checklist semua
POST /api/user/checklist -> post data checklist
--> with json body request
---> title: string
PUT /api/user/checklist/[checklistId] -> ubah done checklist menjadi true
GET /api/user/checklist/[checklistId] -> detail checklist
DELETE /api/user/checklist/[checklistId] -> hapus check list

POST /api/user/checklist/[checklistId]/items -> create items
--> with json body request
---> items: string
PUT /api/user/checklist/[checklistId]/items/[itemsId] -> ubah done checklist menjadi true
PATCH /api/user/checklist/[checklistId]/items/[itemsId] -> ubah items checklist 
--> with json body request
---> items: string
GET /api/user/checklist/[checklistId]/items/[itemsId] -> get detaill item
DELETE /api/user/checklist/[checklistId]/items/[itemsId]-> hapus detail items
