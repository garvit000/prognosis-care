export const departments = [
  'General Medicine',
  'Neurology',
  'Cardiology',
  'Pulmonology',
  'Endocrinology',
  'Oncology',
  'Dermatology',
  'Pathology',
  'ENT',
  'Nutrients & Dietetics',
];

export const departmentList = departments;

const stockProfileImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551601651-bc60f254d532?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584467735871-10f1c1f4d48f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
];

const departmentMeta = {
  'General Medicine': {
    specialization: 'Internal Medicine & Preventive Care',
    institution: 'CMC Vellore',
    advancedDegree: 'MD General Medicine',
    fee: 850,
    slots: ['9:30 AM', '11:15 AM', '4:45 PM'],
    schedule: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 2:00 PM',
      Sunday: 'Off',
    },
  },
  Neurology: {
    specialization: 'Stroke & Neuro-Critical Care',
    institution: 'NIMHANS Bengaluru',
    advancedDegree: 'DM Neurology',
    fee: 1250,
    slots: ['10:30 AM', '1:00 PM', '5:00 PM'],
    schedule: {
      Monday: '10:00 AM - 6:00 PM',
      Tuesday: '10:00 AM - 6:00 PM',
      Wednesday: '10:00 AM - 6:00 PM',
      Thursday: 'Off',
      Friday: '10:00 AM - 6:00 PM',
      Saturday: '10:00 AM - 1:00 PM',
      Sunday: 'Off',
    },
  },
  Cardiology: {
    specialization: 'Interventional Cardiology',
    institution: 'AIIMS New Delhi',
    advancedDegree: 'DM Cardiology',
    fee: 1400,
    slots: ['9:45 AM', '12:30 PM', '3:15 PM'],
    schedule: {
      Monday: '9:00 AM - 4:00 PM',
      Tuesday: '9:00 AM - 4:00 PM',
      Wednesday: '9:00 AM - 4:00 PM',
      Thursday: '9:00 AM - 4:00 PM',
      Friday: '10:00 AM - 4:00 PM',
      Saturday: '10:00 AM - 1:00 PM',
      Sunday: 'Off',
    },
  },
  Pulmonology: {
    specialization: 'Respiratory & Sleep Medicine',
    institution: 'JIPMER Puducherry',
    advancedDegree: 'DM Pulmonology',
    fee: 1150,
    slots: ['11:00 AM', '2:15 PM', '5:15 PM'],
    schedule: {
      Monday: '11:00 AM - 6:00 PM',
      Tuesday: '11:00 AM - 6:00 PM',
      Wednesday: 'Off',
      Thursday: '11:00 AM - 6:00 PM',
      Friday: '11:00 AM - 6:00 PM',
      Saturday: '11:00 AM - 2:00 PM',
      Sunday: 'Off',
    },
  },
  Endocrinology: {
    specialization: 'Diabetes, Thyroid & Metabolic Care',
    institution: 'KEM Mumbai',
    advancedDegree: 'DM Endocrinology',
    fee: 1100,
    slots: ['10:15 AM', '1:45 PM', '5:30 PM'],
    schedule: {
      Monday: '10:00 AM - 6:00 PM',
      Tuesday: 'Off',
      Wednesday: '10:00 AM - 6:00 PM',
      Thursday: '10:00 AM - 6:00 PM',
      Friday: '10:00 AM - 6:00 PM',
      Saturday: '10:00 AM - 1:00 PM',
      Sunday: 'Off',
    },
  },
  Oncology: {
    specialization: 'Medical Oncology',
    institution: 'Tata Memorial Hospital',
    advancedDegree: 'DM Oncology',
    fee: 1600,
    slots: ['9:30 AM', '12:00 PM', '2:30 PM'],
    schedule: {
      Monday: '9:00 AM - 3:00 PM',
      Tuesday: '9:00 AM - 3:00 PM',
      Wednesday: '9:00 AM - 3:00 PM',
      Thursday: 'Off',
      Friday: '9:00 AM - 3:00 PM',
      Saturday: 'Off',
      Sunday: 'Off',
    },
  },
  Dermatology: {
    specialization: 'Clinical & Aesthetic Dermatology',
    institution: 'PGIMER Chandigarh',
    advancedDegree: 'MD Dermatology',
    fee: 900,
    slots: ['10:00 AM', '12:45 PM', '4:30 PM'],
    schedule: {
      Monday: '10:00 AM - 5:00 PM',
      Tuesday: '10:00 AM - 5:00 PM',
      Wednesday: '10:00 AM - 5:00 PM',
      Thursday: 'Off',
      Friday: '10:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 1:00 PM',
      Sunday: 'Off',
    },
  },
  Pathology: {
    specialization: 'Clinical Pathology & Lab Medicine',
    institution: 'AFMC Pune',
    advancedDegree: 'MD Pathology',
    fee: 750,
    slots: ['9:15 AM', '1:15 PM', '3:45 PM'],
    schedule: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: '10:00 AM - 1:00 PM',
      Sunday: 'Off',
    },
  },
  ENT: {
    specialization: 'Otorhinolaryngology',
    institution: 'Grant Medical College',
    advancedDegree: 'MS ENT',
    fee: 950,
    slots: ['11:15 AM', '2:30 PM', '5:00 PM'],
    schedule: {
      Monday: '11:00 AM - 6:00 PM',
      Tuesday: '11:00 AM - 6:00 PM',
      Wednesday: 'Off',
      Thursday: '11:00 AM - 6:00 PM',
      Friday: '11:00 AM - 6:00 PM',
      Saturday: '11:00 AM - 2:00 PM',
      Sunday: 'Off',
    },
  },
  'Nutrients & Dietetics': {
    specialization: 'Clinical Nutrition & Dietetics',
    institution: 'University of Delhi',
    advancedDegree: 'MSc Clinical Nutrition',
    fee: 700,
    slots: ['10:00 AM', '1:15 PM', '5:45 PM'],
    schedule: {
      Monday: '10:00 AM - 6:00 PM',
      Tuesday: '10:00 AM - 6:00 PM',
      Wednesday: '10:00 AM - 6:00 PM',
      Thursday: '10:00 AM - 6:00 PM',
      Friday: '10:00 AM - 6:00 PM',
      Saturday: '10:00 AM - 2:00 PM',
      Sunday: 'Off',
    },
  },
};

const namesByDepartment = {
  'General Medicine': [
    ['Dr. Rohit Sharma', 'Male'],
    ['Dr. Ananya Iyer', 'Female'],
    ['Dr. Kunal Verma', 'Male'],
    ['Dr. Priya Menon', 'Female'],
    ['Dr. Nikhil Saha', 'Male'],
  ],
  Neurology: [
    ['Dr. Arjun Menon', 'Male'],
    ['Dr. Meenal Joshi', 'Female'],
    ['Dr. Saurabh Kulkarni', 'Male'],
    ['Dr. Ishita Chawla', 'Female'],
    ['Dr. Ritesh Rao', 'Male'],
  ],
  Cardiology: [
    ['Dr. Meera Singh', 'Female'],
    ['Dr. Akash Nambiar', 'Male'],
    ['Dr. Devika Rao', 'Female'],
    ['Dr. Harshad Bhat', 'Male'],
    ['Dr. Kavita Trivedi', 'Female'],
  ],
  Pulmonology: [
    ['Dr. Vikram Iyer', 'Male'],
    ['Dr. Shreya Naik', 'Female'],
    ['Dr. Varun Gupta', 'Male'],
    ['Dr. Neha Bedi', 'Female'],
    ['Dr. Aditya Pillai', 'Male'],
  ],
  Endocrinology: [
    ['Dr. Sana Khan', 'Female'],
    ['Dr. Piyush Arora', 'Male'],
    ['Dr. Radhika Paul', 'Female'],
    ['Dr. Manav Thakur', 'Male'],
    ['Dr. Sneha Reddy', 'Female'],
  ],
  Oncology: [
    ['Dr. Raghav Bose', 'Male'],
    ['Dr. Aditi Kapoor', 'Female'],
    ['Dr. Sameer Kaul', 'Male'],
    ['Dr. Sanya Banerjee', 'Female'],
    ['Dr. Mihir Chandra', 'Male'],
  ],
  Dermatology: [
    ['Dr. Kavya Reddy', 'Female'],
    ['Dr. Pranav Nair', 'Male'],
    ['Dr. Isha Malhotra', 'Female'],
    ['Dr. Rohan Deshmukh', 'Male'],
    ['Dr. Tanya Walia', 'Female'],
  ],
  Pathology: [
    ['Dr. Rohan Gupta', 'Male'],
    ['Dr. Parul Jain', 'Female'],
    ['Dr. Tarun Madan', 'Male'],
    ['Dr. Nisha Prabhu', 'Female'],
    ['Dr. Hemant Dutta', 'Male'],
  ],
  ENT: [
    ['Dr. Isha Nair', 'Female'],
    ['Dr. Vivek Anand', 'Male'],
    ['Dr. Charu Bansal', 'Female'],
    ['Dr. Abhishek Sen', 'Male'],
    ['Dr. Ritu Agarwal', 'Female'],
  ],
  'Nutrients & Dietetics': [
    ['Dr. Pooja Jain', 'Female'],
    ['Dr. Nitin Khanna', 'Male'],
    ['Dr. Saloni Mehta', 'Female'],
    ['Dr. Aravind Raj', 'Male'],
    ['Dr. Nupur Soni', 'Female'],
  ],
};

function slugifyDepartment(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export { slugifyDepartment };

const hospitals = [
  'CityCare Multi-Speciality Hospital',
  'Metro Diagnostics & Daycare Center',
  'Lifeline Heart & Wellness Institute',
];

function createDoctor(department, index, [fullName, gender]) {
  const meta = departmentMeta[department];
  const startYear = 2004 + (index % 5);
  const experienceYears = 8 + ((index * 3 + department.length) % 18);
  const id = `${department.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`;

  return {
    id,
    fullName,
    gender,
    department,
    specialization: meta.specialization,
    experienceYears,
    educationShort: `${meta.advancedDegree}, ${meta.institution}`,
    educationHistory: [
      {
        degree: 'MBBS',
        institution: 'AIIMS New Delhi',
        year: `${startYear}`,
      },
      {
        degree: meta.advancedDegree,
        institution: meta.institution,
        year: `${startYear + 5}`,
      },
    ],
    consultationFee: meta.fee + (index % 3) * 100,
    languages: index % 2 === 0 ? ['English', 'Hindi'] : ['English', 'Hindi', 'Regional'],
    profileImage: stockProfileImages[(index + department.length) % stockProfileImages.length],
    availabilityStatus: index % 7 === 0 ? 'Fully Booked' : 'Available',
    weeklyAvailability: meta.schedule,
    availableTimeSlots: index % 7 === 0 ? [] : meta.slots,
    professionalBio: `${fullName} is a ${meta.specialization.toLowerCase()} specialist with ${experienceYears} years of clinical experience and a strong focus on evidence-based patient care.`,
    workTimeline: [
      {
        period: `${startYear + 5} - ${startYear + 9}`,
        role: `Consultant ${department} Specialist, ${hospitals[index % hospitals.length]}`,
      },
      {
        period: `${startYear + 9} - Present`,
        role: `Senior Consultant, ${hospitals[(index + 1) % hospitals.length]}`,
      },
    ],
    hospitalAffiliation: hospitals[index % hospitals.length],
    certifications: ['Medical Council Registered', 'Advanced Clinical Training'],
    publications: ['Clinical outcomes review (mock)', 'Departmental case series (mock)'],
    patientReviews: [
      {
        reviewer: 'Patient A.',
        rating: 5,
        comment: 'Very clear explanation and supportive consultation.',
      },
      {
        reviewer: 'Patient B.',
        rating: 4,
        comment: 'Professional and punctual. Helpful treatment plan.',
      },
    ],
  };
}

export const doctors = departments.flatMap((department) =>
  namesByDepartment[department].map((nameTuple, index) => createDoctor(department, index, nameTuple))
);

export function getDoctorsByDepartment(departmentName) {
  return doctors.filter((doctor) => doctor.department === departmentName);
}

export function getDoctorById(doctorId) {
  return doctors.find((doctor) => doctor.id === doctorId);
}

export function getDepartmentNameFromSlug(slug) {
  return departments.find((name) => slugifyDepartment(name) === slug);
}
