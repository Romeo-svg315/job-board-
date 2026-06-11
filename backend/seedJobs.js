const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
require('dotenv').config();

const sampleJobs = [
  {
    title: 'Senior Full-Stack Engineer',
    type: 'Full-Time',
    description: 'Work on our main product stack (Node.js, Vue, MongoDB). Lead feature development and mentor juniors.',
    company: {
      name: 'TechNova Inc',
      description: 'A fast-growing SaaS startup focused on developer tools.',
      contactEmail: 'hr@technova.example.com',
    },
    location: 'San Francisco, CA',
    salary: '$140k - $170k',
  },
  {
    title: 'Frontend Engineer (Vue.js)',
    type: 'Remote',
    description: 'Build responsive UI components and improve performance in our Vue-based frontend.',
    company: {
      name: 'PixelCraft',
      description: 'Design-first product studio.',
      contactEmail: 'careers@pixelcraft.example.com',
    },
    location: 'Remote',
    salary: '$90k - $120k',
  },
  {
    title: 'Product Designer (Contract)',
    type: 'Contract',
    description: 'Design end-to-end user experiences for new features.',
    company: {
      name: 'BrightIdeas LLC',
      contactEmail: 'design@brightideas.example.com',
    },
    location: 'New York, NY',
    salary: 'Negotiable',
  },
  {
    title: 'Backend Intern',
    type: 'Internship',
    description: 'Assist in building REST APIs and learning best practices.',
    company: {
      name: 'OpenQuest',
      contactEmail: 'interns@openquest.example.com',
    },
    location: 'Austin, TX',
    salary: '$20/hr',
  },
  {
    title: 'Part-Time QA Tester',
    type: 'Part-Time',
    description: 'Help test releases and write automation scripts.',
    company: {
      name: 'QualityFirst',
      contactEmail: 'jobs@qualityfirst.example.com',
    },
    location: 'Chicago, IL',
    salary: '$25/hr',
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use an existing employer user, or create a placeholder employer
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      employer = new User({
        email: 'employer@jobboard.com',
        password: 'employerpassword',
        role: 'employer',
        status: 'active',
      });
      await employer.save();
      console.log('Created placeholder employer:', employer.email);
    }

    // Attach postedBy and insert jobs
    const jobsToInsert = sampleJobs.map(job => ({ ...job, postedBy: employer._id }));

    await Job.insertMany(jobsToInsert);
    console.log('Sample jobs inserted');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedJobs();
