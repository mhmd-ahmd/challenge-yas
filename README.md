# Yassir's Platform Challenge Solution

## Overview

Welcome to the coffee ordering platform designed to grab coffee orders for developers and platform engineers! The goal is to facilitate the ordering of coffee (ressources) by allowing developers to define orders as folders, with each folder name serving as a unique resource identifier. Each file within the folder represents a single item in the order, specifying the id and quantity for that item.

## Prerequisites
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download) (version >= 21.x)
- [pnpm](https://pnpm.io/installation)

## Getting Started

1. Clone the repo
   ```sh
   git clone https://github.com/capotoa/yasir-ch.git 
   ```
2. Install dependencies
   ```sh
   cd challenge-yas
   pnpm install
   ```
3. To instanciate the Hashicups API locally, navigate to the `./docker_compose` directory and run the following command:
   ```sh
   cd dckr_cmps
   sudo docker-compose up -d
   cd ..
   ```
   This will start the Hashicups API. You can reach the frontend at http://localhost:3000
4. Sign Up an authenticated user that will interact with the Hashicups API:
   ```sh
   curl -X POST localhost:9090/signup -d '{"username":"education", "password":"test123"}'
   ```
5. Export the generated token as we may need it later to perform CRUD operations:
    ```sh
   export TOKEN=PASTE_YOUR_TOKEN
   ```
    
## Solution Approach

> **Note**<br>
host the provider on a private registry using AWS Cloud. 

```bash
```

#### Order Creation:

Create coffee order folders in the `./packages/iac/orders` directory, and place JSON files inside representing each item in the order. An example of 2 orders with 2 items each has been provided:
```sh
/orders
├── /order_1
│   ├── item_1.json
│   └── item_2.json
└── /order_2
    ├── item_1.json
    └── item_2.json
```
   ```sh
// item_1.json
{
  "quantity": 2,
  "coffee": {
    "id": 7
  }
}
   ```

#### Fetching The Hashicups Provider:

Run the following command in the `./packages/iac` directory to fetch the Hashicups provider:
   ```sh
pnpm run cdktf:get
```

#### Unit Tests:

It is recommended to run unit tests after fetching the Hashicups provider to make sure CDKTF synthesizes the infrastructure correctly. Run the following command to do so:
   ```sh
pnpm test
```

#### Applying the Infrastructure

Run the following commands to apply the infrastructure:

```
## Synthesize the Terraform configuration
pnpm run cdktf:synth
```
```
## Deploy the stack
pnpm run cdktf:deploy
```

#### Interacting with the Hashicups API:
After Deploying the stack, you can see the created orders through the frontend http://localhost:3000 :


Alternatively, you can use these set of commands to interact with the API:
   ```sh
Get order details by id:
curl -X GET  -H "Authorization: $TOKEN" localhost:9090/orders/1

Get order details for all order:
curl -X GET  -H "Authorization: $TOKEN" localhost:9090/orders

Delete order by id:
curl -X DELETE  -H "Authorization: $TOKEN" localhost:9090/orders/1
```
#### Cleaning-up the infrastructure

To destroy the stack created, just run:

```sh
pnpm run cdktf:destroy
```
Also, don't forget to remove the docker_compose containers:

```sh
sudo docker compose down
```

### Remote Private Registry Implementation

Due to limitations in working with the Hashicups provider and the desire for a more comprehensive solution, a decision was made to publish the Hashicups provider to a private registry. This step was essential to overcome issues with the existing Hashicups provider in the Terraform registry, which seems to be broken.

The private registry was implemented following Terraform's [Provider Registry Protocol](https://developer.hashicorp.com/terraform/internals/provider-registry-protocol). The provider code was fixed, built from source, tested, and then released with artifacts signed using GPG keys. Finally, an AWS S3 bucket was set up as a private registry (instead of registry.terraform.io).
