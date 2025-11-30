# MVP Features Specification

## Purpose
Define core functionality required for minimum viable product deployment.

## Requirements

### Requirement: Job Management System
The application SHALL provide job creation, listing, and management functionality.

#### Scenario: Job creation workflow
- **WHEN** users create new jobs
- **THEN** require title, description, category, and urgency level
- **AND** validate all required fields before submission

#### Scenario: Job listing and filtering
- **WHEN** users view the job list
- **THEN** display all available jobs with basic information
- **AND** provide filtering by category and urgency

#### Scenario: Job status management
- **WHEN** job creators update job status
- **THEN** allow status changes from pending to in-progress to completed
- **AND** maintain status history for audit purposes

### Requirement: Waste Reporting System
The application SHALL enable users to report waste collection points.

#### Scenario: Waste report submission
- **WHEN** users report waste locations
- **THEN** collect location details, waste type, and description
- **AND** optionally capture photographic evidence

#### Scenario: Waste report display
- **WHEN** users view reported waste locations
- **THEN** show location markers with basic waste information
- **AND** provide filtering by waste type and collection status

### Requirement: User Profile Management
The application SHALL provide basic user profile functionality.

#### Scenario: Profile creation and editing
- **WHEN** users set up their profiles
- **THEN** collect name, contact information, and skills/abilities
- **AND** allow role selection (helper, requester, or both)

#### Scenario: Profile display
- **WHEN** viewing user profiles
- **THEN** show relevant user information and capabilities
- **AND** display job history and completion rates