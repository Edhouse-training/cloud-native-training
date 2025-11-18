## Cloud native development hands-on

### Repository content

- backend-application - Simple Node.JS application. API for frontend provides reading/storing value to Redis database.
- fronted-application - Simple Node.JS application with web UI.
- Dockerfiles for creating Docker images for backend and frontend application.
- Docker compose file for running frontend-backend-redis solution.

### Prerequisities

- Installed runtime environment - Docker
- Installed Kind `winget install Kubernetes.kind`

### How to deploy the application with docker compose

- Build Docker images for backend and frontend from Dockerfile. Backend and frontend are used in Helm example

        docker build -t my-backend backend-application
        docker build -t my-frontend frontend-application

- Run docker compose
    - `docker compose up`

### How to deploy the simple application with k8 templates

- Create kind cluster via: `kind create cluster --config kind-config.yaml`
- Build Docker images for simple-application from Dockerfile. Simple application is used in Kubernetes manifest examples

        docker build -t my-simple-app simple-application
        kind load docker-image my-simple-app

- Apply k8s manifests via kubectl: `kubectl apply -f deployment/k8s-simple-app/`
- Access the application via http://localhost:30000
- Check logs for request timestamps

### How to deploy the application in with k8 templates

- Create kind cluster via: `kind create cluster --config kind-config.yaml`
- Build and load docker images into kind:

        docker build -t my-backend ./backend-application
        docker build -t my-frontend ./frontend-application
        kind load docker-image my-backend
        kind load docker-image my-frontend

- Apply k8s manifests via kubectl: `kubectl apply -f deployment/k8s/`
- Access the application via http://localhost:30001

### How to deploy the application with helm + Ingress

- Create kind cluster via: `kind create cluster --config kind-config.yaml`
- Install ingress with `kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml`
- Build and load docker images into kind:

        docker build -t my-backend ./backend-application
        docker build -t my-frontend ./frontend-application
        kind load docker-image my-backend
        kind load docker-image my-frontend

- Install app with helm:

    cd deployment\helm\workshop-application
    helm dependency update
    helm install my-app .

- The application should be ready at http://localhost/

### How to demonstrate load balancing

- `kubectl logs -l app=my-app-backend --all-containers=true --timestamps | sort`