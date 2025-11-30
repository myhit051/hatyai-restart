## ADDED Requirements

### Requirement: Repair Services Marketplace
The platform SHALL provide a comprehensive repair services marketplace connecting flood victims with qualified technicians and service providers.

#### Scenario: Service request creation
- **WHEN** flood victims need repair services
- **THEN** they can submit detailed repair requests with photos, damage type, urgency level, and location
- **AND** requests are automatically categorized and prioritized based on urgency

#### Scenario: Technician availability and matching
- **WHEN** system receives repair requests
- **THEN** it identifies available technicians with relevant skills
- **AND** provides matching recommendations based on location, expertise, and availability

#### Scenario: Real-time status tracking
- **WHEN** repair jobs are in progress
- **THEN** all stakeholders can view real-time status updates
- **AND** receive notifications for status changes and completion

## MODIFIED Requirements

### Requirement: Job Management System
The application SHALL provide comprehensive job creation, assignment, tracking, and management functionality for repair services.

#### Scenario: Job creation workflow
- **WHEN** users create new repair jobs
- **THEN** require detailed damage description, repair type, location, urgency level, and supporting photos
- **AND** automatically estimate repair scope and recommend appropriate technician categories
- **AND** validate all required fields before submission

#### Scenario: Job assignment and dispatch
- **WHEN** repair jobs are submitted
- **THEN** system automatically matches and notifies available technicians
- **AND** allows manual assignment overrides by coordinators
- **AND** provides technicians with complete job details and navigation

#### Scenario: Job progress tracking
- **WHEN** technicians work on assigned jobs
- **THEN** they can update status with photos and progress notes
- **AND** maintain complete audit trail of all activities
- **AND** enable real-time communication between technicians and requesters