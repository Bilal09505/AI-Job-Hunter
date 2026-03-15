# AI Job Hunter – Angular + NestJS

An AI-powered platform that helps developers automate professional content creation, discover remote jobs, and manage job applications from a single dashboard.

The application combines an Angular frontend with a NestJS backend and integrates AI services to generate LinkedIn posts, optimize resumes, analyze job descriptions, and track job applications.

---

# Overview

AI Job Hunter is designed for developers who want to improve their visibility, automate repetitive tasks, and organize their job search process efficiently.

The system provides:

• AI generated LinkedIn posts
• Remote job aggregation
• Resume and cover letter generation
• Job application tracking
• Skill match analysis using AI
• Scheduled content generation

The platform is especially useful for developers seeking remote work opportunities on platforms such as LinkedIn and Indeed.

---

# Technology Stack

## Frontend

* Angular
* TypeScript
* RxJS
* Angular Router
* Angular Signals
* TailwindCSS or SCSS (optional)

## Backend

* NestJS
* Node.js
* TypeScript
* REST API

## Database

* MongoDB
* Mongoose

## AI Integration

* OpenAI API

## Deployment

Frontend

* Firebase Hosting
* Vercel

Backend

* Railway
* Render
* Docker

---

# System Architecture

Frontend (Angular)

User Interface
Dashboard
Job search
AI tools

↓

Backend (NestJS API)

Authentication
AI processing
Job aggregation
Application tracking

↓

External Services

AI provider
Job APIs
Cloud hosting

---

# Features

## AI LinkedIn Post Generator

Automatically generates professional LinkedIn posts based on developer topics.

Example topics:

Angular Signals
NestJS Interceptors
TypeScript Generics
Backend Architecture

Users can preview and edit generated content before posting.

---

## Remote Job Aggregator

The platform fetches remote job listings using public job APIs.

Search examples:

* Angular Developer Remote
* NestJS Developer Remote
* Full Stack Developer Remote

Results include:

Job title
Company
Location
Application link

---

## Resume Optimization

Users can upload or paste their resume.

AI analyzes job descriptions and suggests improvements such as:

Skill alignment
Keyword optimization
Structure improvements

---

## AI Cover Letter Generator

The system generates tailored cover letters based on:

Job description
User profile
Experience level

---

## Job Application Tracker

Tracks job applications in one dashboard.

Information stored:

Company name
Job title
Application date
Status

Status examples:

Applied
Interview
Offer
Rejected

---

## Skill Match Analysis

AI compares job descriptions with a user’s skill profile.

Example output:

Match Score: 82%

Matched Skills
Angular
TypeScript
Node.js

Missing Skills
AWS
Docker

---

## Automated Content Scheduler

Automatically generates developer posts on a schedule.

Example schedule:

Monday – Angular tips
Wednesday – Backend architecture
Friday – TypeScript concepts

This helps improve visibility to recruiters.

---

# Project Structure

## Root Structure

ai-job-hunter

frontend-angular
backend-nestjs

---

## Angular Frontend Structure

src/app

core
services
interceptors
guards

shared
components
pipes

features
dashboard
ai-post
jobs
applications
resume

layout
navbar
sidebar

app.routes.ts
main.ts

---

## NestJS Backend Structure

src

config
database
common

modules

ai
jobs
applications
posts
resume
scheduler
auth

app.module.ts
main.ts

---

# Installation

## 1. Clone Repository

git clone https://github.com/username/ai-job-hunter.git

cd ai-job-hunter

---

# Frontend Setup

Navigate to frontend folder.

cd frontend-angular

Install dependencies.

npm install

Run development server.

ng serve

Application runs at:

http://localhost:4200

---

# Backend Setup

Navigate to backend folder.

cd backend-nestjs

Install dependencies.

npm install

Run development server.

npm run start:dev

Backend runs at:

http://localhost:3000

---

# Environment Variables

Create a .env file in the backend directory.

Example configuration:

PORT=3000

MONGO_URI=mongodb://localhost:27017/ai-job-hunter

OPENAI_API_KEY=your_openai_api_key

JWT_SECRET=supersecretkey

---

# API Endpoints

## AI Endpoints

POST /ai/post
Generate LinkedIn post

POST /ai/cover-letter
Generate cover letter

POST /ai/resume-optimize
Optimize resume

---

## Job Endpoints

GET /jobs/search
Search remote jobs

GET /jobs/:id
Get job details

---

## Application Endpoints

POST /applications
Create new application

GET /applications
List applications

PATCH /applications/:id
Update application status

---

# Database Models

## User

name
email
password
skills
experience

---

## Job

title
company
location
description
applyUrl

---

## Application

userId
jobId
status
notes

---

# Security

Authentication uses JWT tokens.

Protected routes require authorization headers.

Passwords are encrypted using bcrypt.

---

# Scheduler

NestJS cron jobs are used to run scheduled tasks.

Example:

Generate daily LinkedIn content
Fetch new remote job listings

---

# Deployment

## Frontend Deployment

Build project.

ng build

Deploy to Firebase or Vercel.

---

## Backend Deployment

Deploy using:

Railway
Render
Docker containers

Example Docker build:

docker build -t ai-job-hunter-backend .

docker run -p 3000:3000 ai-job-hunter-backend

---

# Future Improvements

Chrome extension for LinkedIn job applications

AI interview preparation assistant

Automatic job alerts

Resume scoring system

Recruiter conversation assistant

---

# Use Case

Developers can use the platform to:

Generate professional posts
Find remote developer jobs
Track job applications
Optimize resumes
Improve visibility to recruiters

---

# License

MIT License

---

# Author

Bilal Hassan

Full Stack Developer

Angular
NestJS
Node.js
TypeScript
