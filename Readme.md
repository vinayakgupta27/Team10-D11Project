# 🏏 Dream11 Fantasy Sports App

## Quick Start Commands

### Prerequisites
- Java 11+, Maven, MySQL, Node.js, Expo CLI

### Database Setup
```sql
mysql -u root -p
CREATE DATABASE Team10Project;
USE Team10Project;

CREATE TABLE contests (
    contestId BIGINT PRIMARY KEY AUTO_INCREMENT,
    contestName VARCHAR(255) NOT NULL,
    contestSize INT DEFAULT 0,
    currentSize INT DEFAULT 0,
    behaviour VARCHAR(100),
    contestCategory VARCHAR(100),
    entryFee DECIMAL(10,2) DEFAULT 0.00,
    firstPrize DECIMAL(10,2) DEFAULT 0.00,
    noOfWinners INT DEFAULT 0,
    prizeAmount DECIMAL(10,2) DEFAULT 0.00,
    isMultiple BOOLEAN DEFAULT FALSE,
    maxTeamsAllowed INT DEFAULT 1,
    title VARCHAR(255) DEFAULT 'General'
);


```

### Backend (Terminal 1)
```bash
cd Team10-D11Project/backend
mvn clean compile exec:java
```
Wait for: `Server started on port 8080`


### Frontend (Terminal 2)
```bash
cd Team10-D11Project/frontend/app
npm install
npm start
```

### Run on Device
- **Android**: Press `a` in Expo terminal
- **iOS**: Press `i` in Expo terminal  
- **Physical Device**: Install Expo Go app and scan QR code

### Test API
```bash
curl http://localhost:8080/api/contests
```
