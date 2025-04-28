# Salonify Database Scripts

This directory contains scripts for managing the Salonify database.

## Database Seeder

The `populate-db.js` script generates realistic test data for your MongoDB database. This is useful for development and testing purposes.

### What the Seeder Creates

* Users (Admin, Salon Owner, Clients)
* Salons with detailed information
* Staff members for each salon
* Services offered by each salon
* Appointments (with various statuses)
* Payments for completed appointments
* Reviews for services

### How to Run the Seeder

1. Make sure your MongoDB server is running
2. Navigate to the scripts directory:
   ```
   cd scripts
   ```
3. Run the script:
   ```
   node populate-db.js
   ```
4. Wait for the script to complete. You should see confirmation messages in the console.

### Troubleshooting

If you encounter errors:

1. **MongoDB Connection Issues**:
   - Ensure MongoDB is running
   - Check the connection string in the script (default is 'mongodb://localhost:27017/salonify')
   - You can modify the script to use a different connection string

2. **Module not found errors**:
   - Ensure you have installed all required packages (`mongoose`, `bcryptjs`)
   - You might need to run `npm install mongoose bcryptjs` if they're not already installed
   - Verify that the paths to the model files are correct

3. **Schema Validation Errors**:
   - If you've modified the database schemas, you may need to update the sample data to match

### Notes

- This script clears all existing data before adding new data
- Generated passwords for all users are set to 'password123'
- The salon owner account email is 'owner@salonify.com' 