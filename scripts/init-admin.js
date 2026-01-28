const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse .env file
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const process = {
  env: envVars
};

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  adminCode: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  assignedBy: {
    type: String,
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function initAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get admin credentials from env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists`);
      console.log(`Admin Code: ${existingAdmin.adminCode}`);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: adminEmail,
      adminCode: adminPassword, // Use password as adminCode
      assignedBy: 'system'
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Admin Code: ${adminPassword}`);
    console.log('\nYou can now login at /admin with these credentials');

  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

initAdmin();
