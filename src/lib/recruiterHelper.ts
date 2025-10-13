export const jobs = [
    {
      "id": "job-001",
      "title": "Frontend Developer",
      "status": "active",
      "clientName": "TechCorp",
      "location": "Remote",
      "createdAt": "2025-01-20"
    },
    {
      "id": "job-002",
      "title": "Backend Developer",
      "status": "pending",
      "clientName": "Innovatech",
      "location": "San Francisco",
      "createdAt": "2025-01-15"
    },
    {
      "id": "job-003",
      "title": "Full Stack Engineer",
      "status": "Closed",
      "clientName": "DevSolutions",
      "location": "New York",
      "createdAt": "2024-12-30"
    }
  ]

  export const candidates = [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+123456789",
      "status": "Shortlisted",
      "appliedFor": "Frontend Developer",
      "location": "Remote",
      "skills": ["React", "TypeScript", "CSS"]
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+987654321",
      "status": "Interviewed",
      "appliedFor": "Backend Developer",
      "location": "San Francisco",
      "skills": ["Node.js", "Express", "MongoDB"]
    },
    {
      "id": "3",
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "phone": "+456789123",
      "status": "Available",
      "appliedFor": null,
      "location": "New York",
      "skills": ["Java", "Spring Boot", "SQL"]
    }
  ]
  
  export const interviewstoday = [
    {
      "id": "interview-001",
      "candidateName": "John Doe",
      "jobTitle": "Frontend Developer",
      "clientName": "TechCorp",
      "date": "2025-01-27",
      "status": "Scheduled"
    },
    {
      "id": "interview-002",
      "candidateName": "Jane Smith",
      "jobTitle": "Backend Developer",
      "clientName": "Innovatech",
      "date": "2025-01-28",
      "status": "Completed"
    },
    {
      "id": "interview-003",
      "candidateName": "Alice Johnson",
      "jobTitle": "Full Stack Engineer",
      "clientName": "DevSolutions",
      "date": "2025-01-29",
      "status": "Pending Feedback"
    }
  ]

export const jobmetadata ={
    "actions": [
      {
        "id": "action-001",
        "label": "Add Job",
        "endpoint": "/api/jobs",
        "method": "POST"
      },
      {
        "id": "action-002",
        "label": "Add Candidate",
        "endpoint": "/contacts/create",
        "method": "POST"
      },
      {
        "id": "action-003",
        "label": "Schedule Interview",
        "endpoint": "/api/interview-rounds",
        "method": "POST"
      },
      {
        "id": "action-004",
        "label": "Search Candidates",
        "endpoint": "/api/search/candidates",
        "method": "POST"
      }
    ]
  }
  
  