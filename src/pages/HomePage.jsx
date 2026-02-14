import { Link } from 'react-router-dom';
import { contractHospitals, contractDepartments } from '../services/contractHospitalData';

function HomePage() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Triage',
      description: 'Get instant preliminary assessment of your symptoms using advanced AI technology.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Connect with experienced specialists across multiple departments at top hospitals.',
    },
    {
      icon: '📅',
      title: 'Easy Appointments',
      description: 'Book appointments with your preferred doctors at your convenience.',
    },
    {
      icon: '🏥',
      title: 'Multi-Hospital Access',
      description: 'Access healthcare services across our network of partner hospitals.',
    },
    {
      icon: '📊',
      title: 'Medical Records',
      description: 'Securely store and access your complete medical history anytime.',
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Get health guidance and support whenever you need it.',
    },
  ];

  const hospitalFacilities = [
    {
      hospital: 'Max Hospital',
      features: ['State-of-the-art infrastructure', 'Advanced diagnostic equipment', '24x7 emergency services', 'NABH accredited facilities', 'International standard patient care', 'Comprehensive specialty departments'],
    },
    {
      hospital: 'Fortis Hospital',
      features: ['Multi-specialty healthcare', 'Advanced surgical facilities', 'ICU & Critical care units', 'Modern pathology labs', 'Expert medical professionals', 'Patient-centric care approach'],
    },
    {
      hospital: 'CityCare Multi-Speciality Hospital',
      features: ['Comprehensive healthcare services', 'Modern medical technology', 'Experienced medical team', 'Efficient patient management', 'Quality healthcare at affordable costs', 'Community-focused healthcare'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-med-500 to-med-700 rounded-xl">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Prognosis Care</h1>
                <p className="text-xs text-med-600 font-medium">AI Healthcare Triage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-med-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-med-600 to-med-700 rounded-lg hover:from-med-700 hover:to-med-800 transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-med-100/50 to-blue-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Your Health, Our{' '}
              <span className="bg-gradient-to-r from-med-600 to-blue-600 bg-clip-text text-transparent">
                Priority
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Experience the future of healthcare with AI-powered diagnosis, expert doctors, and seamless appointment booking - all in one platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-med-600 to-med-700 rounded-xl hover:from-med-700 hover:to-med-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <a
                href="#hospitals"
                className="px-8 py-4 text-lg font-semibold text-med-700 bg-white border-2 border-med-600 rounded-xl hover:bg-med-50 transition-all shadow-lg"
              >
                Our Hospitals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Prognosis Care?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions powered by cutting-edge technology and expert medical professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-slate-200 hover:border-med-300 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-med-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Medical Departments
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Access specialized care across {contractDepartments.length} medical departments with expert doctors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {contractDepartments.map((dept, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-med-400 hover:shadow-md transition-all text-center"
              >
                <p className="text-sm font-semibold text-slate-800">{dept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospitals Section */}
      <section id="hospitals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Our Partner Hospitals
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've partnered with the best healthcare institutions to provide you with top-quality medical care
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {hospitalFacilities.map((hospital, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-med-50/30 rounded-2xl border-2 border-med-200 p-8 hover:border-med-400 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-med-500 to-med-700 rounded-2xl mb-6 mx-auto">
                  <span className="text-white text-2xl font-bold">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  {hospital.hospital}
                </h3>
                <ul className="space-y-3">
                  {hospital.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-med-600 mt-1">✓</span>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-med-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started with healthcare made simple in just a few steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your account in minutes' },
              { step: '2', title: 'Choose Hospital', description: 'Select your preferred hospital' },
              { step: '3', title: 'AI Triage', description: 'Get instant health assessment' },
              { step: '4', title: 'Book Appointment', description: 'Schedule with expert doctors' },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-med-600 to-med-700 text-white text-2xl font-bold rounded-full mb-4 mx-auto shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-med-400 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-med-600 mb-2">{contractHospitals.length}</div>
              <p className="text-slate-600 font-medium">Partner Hospitals</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-med-600 mb-2">100+</div>
              <p className="text-slate-600 font-medium">Expert Doctors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-med-600 mb-2">{contractDepartments.length}</div>
              <p className="text-slate-600 font-medium">Medical Departments</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-med-600 mb-2">24/7</div>
              <p className="text-slate-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-med-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of patients who trust Prognosis Care for their healthcare needs
          </p>
          <Link
            to="/auth"
            className="inline-block px-8 py-4 text-lg font-semibold text-med-700 bg-white rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-med-500 to-med-700 rounded-xl">
                  <span className="text-white text-xl font-bold">P</span>
                </div>
                <h3 className="text-xl font-bold text-white">Prognosis Care</h3>
              </div>
              <p className="text-sm text-slate-400">
                Transforming healthcare with AI-powered diagnostics and seamless patient care.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth" className="hover:text-med-400 transition-colors">Login</Link></li>
                <li><Link to="/auth" className="hover:text-med-400 transition-colors">Sign Up</Link></li>
                <li><a href="#hospitals" className="hover:text-med-400 transition-colors">Our Hospitals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <p className="text-sm text-slate-400">
                Email: support@prognosiscare.com<br />
                Phone: +91 1800-123-4567<br />
                Available 24/7
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Prognosis Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
