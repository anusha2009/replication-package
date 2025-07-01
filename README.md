# Tool Support for Semi-Automated Evaluation of Software Architecture by Leveraging Large Language Models
This repository is a companion page for the following thesis:
> Anusha Annengala. 2025. Tool Support for Semi-Automated Evaluation of Software Architecture by Leveraging Large Language Models. Vrije Universiteit Amsterdam.

It contains all the material required for replicating the study, including: source code, evalaution script, results of manual and LLM extraction, results of requirement indentification, related literature.

## Getting started

1. Data from requirement identification, design and evalaution phase are present in the [data](https://github.com/anusha2009/replication-package/tree/main/data) folder.

2. Source code of the automation tool is present in the [src](https://github.com/anusha2009/replication-package/tree/main/src) folder.

## Prerequisites to run the tool

1. Python 3.12.0, pip 
2. Node.js, NPM


## Steps to run the tool

1. Clone the Repository
```
git clone https://github.com/anusha2009/replication-package.git
cd replication-package/src
```
2. Backend setup

```
cd sa-automation/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
3. Frontend setup

```
cd ../frontend
npm install
npm start
```

The tool is now accessible [here](http://localhost:3000).




