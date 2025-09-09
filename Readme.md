# NP-Complete Project Setup

> This project uses separate environments for the frontend and backend.

---

## Backend Setup

1. **Create and activate a virtual environment** for the backend.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Setting up Elastic Search
1. Install Docker Desktop (if needed)
2. Run this command to create a local instance of elastic search

   ```bash
   curl -fsSL https://elastic.co/start-local | sh
   ```

3. Retrieve your password for the instance with the following command

```bash
docker inspect {DOCKER_INSTANCE_NAME} | grep ELASTIC_PASSWORD
```

Note: The docker instance name can be found within docker desktop. E.g., mine was `es-local-dev`.

4. Create a .env file in the top level directory and add the following lines

```bash
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD={PASSWORD}
ELASTIC_HOST=http://localhost:9200
```

Note: Password will come from step 3 and HOST will change depending on what instance you are connecting to.

5. Run the manager script to test that the connection is successful (if so, you will see JSON formatted info printed out). Make sure to be within the backend directory with the python environment activated and requirements installed.

```bash
python es_manager.py
```

## Frontend Setup

1. **Create and activate a virtual environment** for the frontend.
2. Install dependencies:

   ```bash
   cd npcomplete
   npm install
   ```

---

## Running the Application

Open two terminals and run the following commands:

**Terminal 1: Start Frontend**

```bash
cd npcomplete
npm start
```

**Terminal 2: Start Backend**

```bash
cd backend
python app.py
```

---
