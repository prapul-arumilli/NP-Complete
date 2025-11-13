# NP-Complete Project Setup

## Environment Setup

The following section will explain how to setup the environment for:

- Backend
- Elasticsearch
- Frontend

### Backend Setup

1. Move into the backend directory.

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment for the backend.

   ```bash
   python -m venv .venv
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Setting up Elastic Search

1. Complete backend setup

2. Install Docker Desktop (if needed)

3. Run this command to create a local docker instance of elasticsearch (run this in the root directory of the project to make running the application easy)

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

6. Generate the json_output. (Make sure to activate the virtual environment from earlier)

   From the root directory, run the following commands sequentially (with the docker container active and running).

   ```bash
   cd data
   python csv_to_json.py
   cd ..
   python backend/bulk_add.py
   ```

7. At this point, you will have the first 999 entries from the Ohio nonprofit BMF loaded into elasticsearch. You can add more by modifying the scripts and downloading the full csv file from [here](https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf).

### Frontend Setup

1. Create and activate a virtual environment for the frontend.

2. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

## Running the Application

Open three terminals and run the following commands (Powershell is recommended):

**Terminal 1: Start Elasticsearch**

```Powershell
cd {elastic_container_directory}
docker compose up
```

**Terminal 2: Start Backend**

```Powershell
cd backend
./.venv/Scripts/activate
python app.py
```

**Terminal 3: Start frontend**

```Powershell
cd frontend
npm start
```
