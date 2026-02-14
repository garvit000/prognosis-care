import { createContext, useContext, useMemo, useState } from 'react';
import {
  createBooking,
  fetchAiRecommendations,
  processMockPayment,
  uploadReportMock,
} from '../services/mockApi';

const AppContext = createContext(null);
const PATIENT_PROFILE_KEY = 'pc_patient_profile';
const APPOINTMENTS_KEY = 'pc_appointments';
const MEDICAL_RECORDS_KEY = 'pc_medical_records';

const emptyPatientProfile = {
  id: 'PAT-1001',
  name: '',
  dob: '',
  bloodGroup: '',
  gender: '',
  emergencyContact: '',
  lastCheckupDate: '',
  riskLevel: 'low',
  bp: '',
};

function getStoredPatientProfile() {
  try {
    const saved = localStorage.getItem(PATIENT_PROFILE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function getStoredList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function inferRiskLevelFromBp(bp) {
  if (!bp?.includes('/')) return 'low';
  const [systolicText, diastolicText] = bp.split('/');
  const systolic = Number(systolicText);
  const diastolic = Number(diastolicText);

  if (Number.isNaN(systolic) || Number.isNaN(diastolic)) return 'low';
  if (systolic >= 140 || diastolic >= 90) return 'high';
  if (systolic >= 130 || diastolic >= 85) return 'medium';
  return 'low';
}

const hospitals = [
  {
    id: 'hosp-1',
    name: 'CityCare Multi-Speciality Hospital',
    locations: ['Downtown Center', 'North Campus', 'East Wing Diagnostics'],
    address: '12 Heartline Ave, MedCity',
    description:
      'A tertiary-care center known for rapid cardiac diagnostics, integrated emergency response, and patient-centric preventive care programs.',
    specialties: ['Cardiology', 'Internal Medicine', 'Radiology', 'Pathology'],
    specialistUnits: [
      'Cardiac Surgery Specialists',
      'Interventional Cardiologists',
      'Neurology Consultants',
      'Orthopedic Surgery Team',
    ],
    facilities: [
      '3T MRI & CT Imaging Suite',
      'Modular Operation Theatres',
      '24/7 Cath Lab',
      'Dialysis & Critical Care ICU',
      'Advanced Pathology & Blood Bank',
    ],
    accreditation: 'NABH Accredited',
    rating: 4.7,
    emergencySupport: '24/7 Emergency & ICU',
    insuranceAvailable: true,
    serviceFee: 199,
    taxRate: 0.12,
  },
];

const storedProfile = getStoredPatientProfile();
const storedAppointments = getStoredList(APPOINTMENTS_KEY);
const storedMedicalRecords = getStoredList(MEDICAL_RECORDS_KEY);

const initialState = {
  patient: storedProfile ? { ...emptyPatientProfile, ...storedProfile } : emptyPatientProfile,
  profileCompleted: Boolean(storedProfile?.name && storedProfile?.dob),
  patientSymptoms: '',
  recommendedTests: [],
  recommendationSummary: '',
  selectedHospital: hospitals[0],
  draftBooking: null,
  latestBooking: null,
  appointments: storedAppointments,
  medicalRecords: storedMedicalRecords,
  paymentHistory: [],
  reports: [],
  notifications: [],
};

function buildBillItems(tests, serviceFee, taxRate, insuranceEnabled) {
  const rows = tests.map((test) => {
    const tax = Math.round(test.cost * taxRate);
    const discounted = insuranceEnabled ? Math.round(test.cost * 0.8) : test.cost;
    return {
      name: test.name,
      basePrice: test.cost,
      discountedPrice: discounted,
      serviceFee,
      tax,
      total: discounted + serviceFee + tax,
    };
  });

  const subtotal = rows.reduce((sum, row) => sum + row.discountedPrice, 0);
  const fees = rows.reduce((sum, row) => sum + row.serviceFee, 0);
  const taxes = rows.reduce((sum, row) => sum + row.tax, 0);

  return {
    rows,
    subtotal,
    fees,
    taxes,
    total: subtotal + fees + taxes,
  };
}

function composeDraftBooking(state, { location, slot, insuranceEnabled }) {
  const bill = buildBillItems(
    state.recommendedTests,
    state.selectedHospital.serviceFee,
    state.selectedHospital.taxRate,
    insuranceEnabled
  );

  return {
    tests: state.recommendedTests,
    hospital: state.selectedHospital,
    location,
    slot,
    insuranceEnabled,
    bill,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState({
    recommendations: false,
    booking: false,
    appointment: false,
    payment: false,
    reportUpload: false,
  });
  const [paymentError, setPaymentError] = useState('');

  const updatePatientProfile = (profileInput) => {
    const riskLevel = inferRiskLevelFromBp(profileInput.bp);
    const nextPatient = {
      ...state.patient,
      ...profileInput,
      riskLevel,
    };

    localStorage.setItem(PATIENT_PROFILE_KEY, JSON.stringify(nextPatient));

    setState((prev) => ({
      ...prev,
      patient: nextPatient,
      profileCompleted: true,
    }));
  };

  const pushNotification = (message) => {
    setState((prev) => ({
      ...prev,
      notifications: [{ id: Date.now(), message }, ...prev.notifications].slice(0, 5),
    }));
  };

  const persistAppointments = (appointments) => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  };

  const persistMedicalRecords = (records) => {
    localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(records));
  };

  const addMedicalRecord = async ({ file, recordType, notes, appointmentId, doctorName }) => {
    const previewUrl = await readFileAsDataURL(file);
    const newRecord = {
      id: `MR-${Date.now().toString().slice(-8)}`,
      fileName: file?.name || 'record',
      mimeType: file?.type || 'application/octet-stream',
      previewUrl,
      recordType,
      notes: notes || '',
      linkedAppointmentId: appointmentId || null,
      linkedDoctorName: doctorName || '',
      uploadDate: new Date().toISOString(),
      source: 'user',
    };

    setState((prev) => {
      const nextRecords = [newRecord, ...prev.medicalRecords];
      persistMedicalRecords(nextRecords);
      return {
        ...prev,
        medicalRecords: nextRecords,
      };
    });

    return newRecord;
  };

  const deleteMedicalRecord = (recordId) => {
    setState((prev) => {
      const nextRecords = prev.medicalRecords.filter((record) => record.id !== recordId);
      persistMedicalRecords(nextRecords);
      return {
        ...prev,
        medicalRecords: nextRecords,
      };
    });
  };

  const addAppointment = async ({ doctor, department, date, time, reason, file, recordType }) => {
    setLoading((prev) => ({ ...prev, appointment: true }));

    const appointmentId = `APT-${Date.now().toString().slice(-8)}`;
    const filePreview = await readFileAsDataURL(file);

    const appointment = {
      id: appointmentId,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      department,
      date,
      time,
      reason,
      consultationFee: doctor.consultationFee,
      status: 'Upcoming',
      createdAt: new Date().toISOString(),
      uploadedMedicalFile: file
        ? {
            fileName: file.name,
            mimeType: file.type,
            previewUrl: filePreview,
          }
        : null,
    };

    setState((prev) => {
      const nextAppointments = [appointment, ...prev.appointments];
      persistAppointments(nextAppointments);
      return {
        ...prev,
        appointments: nextAppointments,
      };
    });

    if (file) {
      await addMedicalRecord({
        file,
        recordType: recordType || 'Appointment Attachment',
        notes: reason,
        appointmentId: appointment.id,
        doctorName: doctor.fullName,
      });
    }

    pushNotification(`Appointment booked with ${doctor.fullName}.`);
    setLoading((prev) => ({ ...prev, appointment: false }));
    return appointment;
  };

  const cancelAppointment = (appointmentId) => {
    setState((prev) => {
      const nextAppointments = prev.appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: 'Cancelled' } : appointment
      );
      persistAppointments(nextAppointments);
      return {
        ...prev,
        appointments: nextAppointments,
      };
    });
    pushNotification('Appointment cancelled.');
  };

  const loadRecommendations = async (symptomsText) => {
    const cleanSymptoms = symptomsText?.trim();
    if (!cleanSymptoms) {
      setState((prev) => ({
        ...prev,
        patientSymptoms: '',
        recommendedTests: [],
        recommendationSummary: '',
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, recommendations: true }));
    const data = await fetchAiRecommendations();
    setState((prev) => ({
      ...prev,
      patientSymptoms: cleanSymptoms,
      recommendedTests: data.tests,
      recommendationSummary: data.summary,
    }));
    setLoading((prev) => ({ ...prev, recommendations: false }));
  };

  const saveDraftBooking = ({ location, slot, insuranceEnabled }) => {
    const draft = composeDraftBooking(state, { location, slot, insuranceEnabled });

    setState((prev) => ({
      ...prev,
      draftBooking: draft,
    }));

    return draft;
  };

  const confirmBooking = async (draftBooking) => {
    const bookingDraft = draftBooking || state.draftBooking;
    if (!bookingDraft) return null;
    setLoading((prev) => ({ ...prev, booking: true }));

    const booking = await createBooking({
      patient: state.patient,
      ...bookingDraft,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
    });

    setState((prev) => ({ ...prev, latestBooking: booking }));
    setLoading((prev) => ({ ...prev, booking: false }));
    return booking;
  };

  const payForBooking = async ({ method, details }) => {
    if (!state.latestBooking) return { ok: false, error: 'Booking missing.' };
    setLoading((prev) => ({ ...prev, payment: true }));
    setPaymentError('');

    const response = await processMockPayment({
      bookingId: state.latestBooking.bookingId,
      amount: state.latestBooking.bill.total,
      method,
      details,
    });

    if (!response.ok) {
      setPaymentError(response.error);
      setLoading((prev) => ({ ...prev, payment: false }));
      return response;
    }

    setState((prev) => {
      const paidBooking = {
        ...prev.latestBooking,
        paymentStatus: 'paid',
        payment: response,
      };

      return {
        ...prev,
        latestBooking: paidBooking,
        paymentHistory: [
          {
            id: response.paymentId,
            invoiceId: response.invoiceId,
            amount: response.amount,
            method: response.method,
            date: response.paidAt,
            bookingId: response.bookingId,
          },
          ...prev.paymentHistory,
        ],
      };
    });

    pushNotification('Your lab test is scheduled. Payment confirmed.');
    setLoading((prev) => ({ ...prev, payment: false }));
    return response;
  };

  const markTestCompleted = () => {
    setState((prev) => {
      if (!prev.latestBooking) return prev;
      return {
        ...prev,
        latestBooking: {
          ...prev.latestBooking,
          status: 'completed',
        },
      };
    });
    pushNotification('Your hospital marked the test as completed.');
  };

  const uploadReport = async (fileName) => {
    if (!state.latestBooking) return null;
    setLoading((prev) => ({ ...prev, reportUpload: true }));

    const report = await uploadReportMock({
      bookingId: state.latestBooking.bookingId,
      fileName,
    });

    setState((prev) => {
      const nextMedicalRecords = [
        {
          id: report.reportId,
          fileName: report.fileName,
          mimeType: 'application/pdf',
          previewUrl: '',
          recordType: 'Lab Report',
          notes: prev.latestBooking.tests.map((test) => test.name).join(', '),
          linkedAppointmentId: null,
          linkedDoctorName: '',
          uploadDate: report.uploadedAt,
          source: 'hospital',
        },
        ...prev.medicalRecords,
      ];

      persistMedicalRecords(nextMedicalRecords);

      return {
        ...prev,
        reports: [
          {
            ...report,
            hospitalName: prev.latestBooking.hospital.name,
            testNames: prev.latestBooking.tests.map((test) => test.name),
          },
          ...prev.reports,
        ],
        medicalRecords: nextMedicalRecords,
        latestBooking: {
          ...prev.latestBooking,
          reportStatus: 'Available',
        },
      };
    });

    setLoading((prev) => ({ ...prev, reportUpload: false }));
    pushNotification('New lab report is now available in Medical Records.');
    return report;
  };

  const value = useMemo(
    () => ({
      state,
      hospitals,
      loading,
      paymentError,
      updatePatientProfile,
      addAppointment,
      cancelAppointment,
      addMedicalRecord,
      deleteMedicalRecord,
      pushNotification,
      loadRecommendations,
      saveDraftBooking,
      confirmBooking,
      payForBooking,
      markTestCompleted,
      uploadReport,
    }),
    [state, loading, paymentError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
