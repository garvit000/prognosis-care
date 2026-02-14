import { useApp } from '../context/AppContext';

function BookingConfirmationPage() {
  const { state } = useApp();
  const booking = state.latestBooking;

  if (!booking || booking.paymentStatus !== 'paid') {
    return (
      <div className="page-shell">
        <section className="card">
          <h2 className="text-xl font-semibold">No Paid Booking Found</h2>
          <p className="mt-2 text-sm text-slate-600">Complete payment to access booking confirmation.</p>
        </section>
      </div>
    );
  }

  const schedule = new Date(booking.slot).toLocaleString();

  return (
    <div className="page-shell">
      <section className="card animate-fadeIn">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Booking Confirmed</p>
        <h2 className="mt-1 text-2xl font-bold">Your Lab Test Is Scheduled</h2>

        <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 p-4 text-sm sm:grid-cols-2">
          <p>
            <span className="font-semibold">Booking ID:</span> {booking.bookingId}
          </p>
          <p>
            <span className="font-semibold">Invoice ID:</span> {booking.payment.invoiceId}
          </p>
          <p>
            <span className="font-semibold">Hospital:</span> {booking.hospital.name}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {booking.hospital.address}
          </p>
          <p>
            <span className="font-semibold">Scheduled:</span> {schedule}
          </p>
          <p>
            <span className="font-semibold">Payment Status:</span> Paid
          </p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">Test Details</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {booking.tests.map((test) => (
              <li key={test.id}>• {test.name}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button className="btn-primary">Download Invoice</button>
          <button className="btn-secondary">Add to Calendar</button>
        </div>
      </section>
    </div>
  );
}

export default BookingConfirmationPage;
