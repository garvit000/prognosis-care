import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingBreakdown from '../components/BillingBreakdown';
import { useApp } from '../context/AppContext';

function LabBookingPage() {
  const navigate = useNavigate();
  const { state, loading, saveDraftBooking, confirmBooking } = useApp();

  const [location, setLocation] = useState(state.selectedHospital.locations[0]);
  const [slot, setSlot] = useState('2026-02-20T10:30');
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  const bill = useMemo(() => {
    const serviceFee = state.selectedHospital.serviceFee;
    const taxRate = state.selectedHospital.taxRate;
    const rows = state.recommendedTests.map((test) => {
      const discountedPrice = insuranceEnabled ? Math.round(test.cost * 0.8) : test.cost;
      const tax = Math.round(test.cost * taxRate);
      return {
        name: test.name,
        basePrice: test.cost,
        discountedPrice,
        serviceFee,
        tax,
        total: discountedPrice + serviceFee + tax,
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
  }, [insuranceEnabled, state.recommendedTests, state.selectedHospital.serviceFee, state.selectedHospital.taxRate]);

  const handleConfirm = async () => {
    const draft = saveDraftBooking({ location, slot, insuranceEnabled });
    await confirmBooking(draft);
    navigate('/payment');
  };

  if (!state.recommendedTests.length) {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">No Tests Selected</h2>
          <p className="mt-2 text-sm text-slate-600">Please complete AI triage before booking tests.</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/triage')}>
            Go to AI Assistant
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-4 lg:grid-cols-5">
      <section className="card space-y-4 lg:col-span-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-med-600">Hospital Booking</p>
          <h2 className="text-xl font-semibold">{state.selectedHospital.name}</h2>
          <p className="text-sm text-slate-600">{state.selectedHospital.address}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Choose Hospital Location</p>
          <select className="input" value={location} onChange={(e) => setLocation(e.target.value)}>
            {state.selectedHospital.locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Preferred Date & Time Slot
          <input className="input mt-2" type="datetime-local" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Insurance Available</p>
            <p className="text-xs text-slate-500">Apply 20% test price coverage</p>
          </div>
          <input
            type="checkbox"
            checked={insuranceEnabled}
            onChange={(e) => setInsuranceEnabled(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <div className="flex gap-2 pt-2">
          <button className="btn-primary flex-1" onClick={handleConfirm} disabled={loading.booking}>
            {loading.booking ? 'Reserving Slot...' : 'Confirm & Pay'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/triage')}>
            Cancel
          </button>
        </div>
      </section>

      <div className="lg:col-span-3">
        <BillingBreakdown bill={bill} title="Itemized Bill" />
      </div>
    </div>
  );
}

export default LabBookingPage;
