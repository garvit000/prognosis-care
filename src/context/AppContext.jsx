import { createContext, useContext, useMemo, useState } from 'react';
import {
  createBooking,
  fetchAiRecommendations,
  processMockPayment,
  uploadReportMock,
} from '../services/mockApi';

const AppContext = createContext(null);

const hospitals = [
  {
    id: 'hosp-1',
    name: 'CityCare Multi-Speciality Hospital',
    locations: ['Downtown Center', 'North Campus', 'East Wing Diagnostics'],
    address: '12 Heartline Ave, MedCity',
    insuranceAvailable: true,
    serviceFee: 199,
    taxRate: 0.12,
  },
];

const initialState = {
  patient: {
    id: 'PAT-1001',
    name: 'Aarav Patel',
    age: 46,
    bp: '150/95',
  },
  recommendedTests: [],
  recommendationSummary: '',
  selectedHospital: hospitals[0],
  draftBooking: null,
  latestBooking: null,
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
    payment: false,
    reportUpload: false,
  });
  const [paymentError, setPaymentError] = useState('');

  const pushNotification = (message) => {
    setState((prev) => ({
      ...prev,
      notifications: [{ id: Date.now(), message }, ...prev.notifications].slice(0, 5),
    }));
  };

  const loadRecommendations = async () => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    const data = await fetchAiRecommendations();
    setState((prev) => ({
      ...prev,
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

    setState((prev) => ({
      ...prev,
      reports: [
        {
          ...report,
          hospitalName: prev.latestBooking.hospital.name,
          testNames: prev.latestBooking.tests.map((test) => test.name),
        },
        ...prev.reports,
      ],
      latestBooking: {
        ...prev.latestBooking,
        reportStatus: 'Available',
      },
    }));

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
