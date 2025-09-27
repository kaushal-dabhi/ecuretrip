import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import PackageCard from '@/components/PackageCard';
import Footer from '@/components/Footer';
import { PACKAGES } from '@/data/packages';
import { Check, DollarSign, Shield, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Packages - Transparent Medical Travel Costs',
  description: 'Discover transparent pricing for medical procedures in India. All-inclusive packages with escrow protection and no hidden fees.',
  openGraph: {
    title: 'Pricing & Packages - Transparent Medical Travel Costs',
    description: 'Discover transparent pricing for medical procedures in India. All-inclusive packages with escrow protection and no hidden fees.',
    type: 'website',
  },
};

const PRICING_FEATURES = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Transparent Pricing",
    description: "All costs clearly listed with no hidden fees or surprise charges"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Escrow Protection",
    description: "Your funds are secure with milestone-based payment releases"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Price Lock",
    description: "Lock your price for 14 days with guaranteed rates"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "All-Inclusive",
    description: "Surgeon fees, hospital stay, medications, and follow-up care included"
  }
];

const ESCROW_INFO = [
  {
    stage: "TeleConsult",
    percentage: "10%",
    amount: "$610",
    description: "Initial consultation and treatment planning"
  },
  {
    stage: "Admission",
    percentage: "40%",
    amount: "$2,440",
    description: "Hospital admission and pre-operative preparation"
  },
  {
    stage: "Surgery",
    percentage: "40%",
    amount: "$2,440",
    description: "Medical procedure and immediate post-op care"
  },
  {
    stage: "Discharge",
    percentage: "10%",
    amount: "$610",
    description: "Final recovery and follow-up planning"
  }
];

export default function PricingPage() {
  // Get featured packages for display
  const featuredPackages = PACKAGES.filter(pkg => 
    pkg.sku.includes('STANDARD') || pkg.sku.includes('PREMIUM')
  ).slice(0, 6);

  return (
    <>
      <JsonLd 
        type="WebPage" 
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "eCureTrip Medical Tourism Platform",
          "description": "Connect with top doctors and hospitals in India for affordable, world-class medical care."
        }} 
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mint-400 via-mint-500 to-sky py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-600 mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-navy-600/90 max-w-3xl mx-auto leading-relaxed">
            All-inclusive medical packages with transparent pricing, escrow protection, 
            and no hidden fees. Your health journey starts with complete cost clarity.
          </p>
        </div>
      </section>

      {/* Pricing Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-600 mb-4">
              Why Our Pricing is Different
            </h2>
            <p className="text-lg text-g600 max-w-2xl mx-auto">
              We believe in complete transparency and value for your medical investment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_FEATURES.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center text-mint-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-600 mb-3">
                  {feature.title}
                </h3>
                <p className="text-g600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-20 bg-beige-paper">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-600 mb-4">
              Featured Treatment Packages
            </h2>
            <p className="text-lg text-g600 max-w-2xl mx-auto">
              Comprehensive packages designed for your specific medical needs with 
              transparent pricing and quality care.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg, index) => (
              <PackageCard 
                key={pkg.sku} 
                package={pkg} 
                variant={index === 0 ? 'featured' : 'default'}
                showAddons={true}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-navy-600 hover:bg-sky text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              View All Packages
            </button>
          </div>
        </div>
      </section>

      {/* Escrow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-600 mb-4">
              How Escrow Protects You
            </h2>
            <p className="text-lg text-g600 max-w-2xl mx-auto">
              Your funds are secure with our milestone-based escrow system. 
              Payments are only released when each stage is completed successfully.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Escrow Stages */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-navy-600 mb-6">
                Payment Milestones
              </h3>
              {ESCROW_INFO.map((stage, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-g50 rounded-lg">
                  <div className="w-12 h-12 bg-navy-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-navy-600">{stage.stage}</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-navy-600">{stage.percentage}</div>
                        <div className="text-sm text-g600">{stage.amount}</div>
                      </div>
                    </div>
                    <p className="text-sm text-g600">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Escrow Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-navy-600 mb-6">
                Escrow Benefits
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-health mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy-600 mb-1">Secure Payments</h4>
                    <p className="text-sm text-g600">Your funds are held securely until services are delivered</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-health mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy-600 mb-1">Milestone Protection</h4>
                    <p className="text-sm text-g600">Payments released only after each stage completion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-health mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy-600 mb-1">Dispute Resolution</h4>
                    <p className="text-sm text-g600">Fair resolution process for any payment disputes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-health mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy-600 mb-1">Refund Protection</h4>
                    <p className="text-sm text-g600">Full refunds available for medically contraindicated cases</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-20 bg-beige-paper">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-600 mb-4">
              Cost Comparison
            </h2>
            <p className="text-lg text-g600 max-w-2xl mx-auto">
              See how much you can save with medical travel while receiving world-class care.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-lg border border-g200 p-8 text-center">
              <h3 className="text-2xl font-bold text-navy-600 mb-4">United States</h3>
              <div className="text-4xl font-bold text-alert mb-2">$45,000</div>
              <p className="text-g600 mb-6">Average TKR cost</p>
              <ul className="text-left space-y-2 text-sm text-g600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>High-quality care</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>Insurance coverage</span>
                </li>
                <li className="flex items-center gap-2 text-g400">
                  <span className="w-4 h-4">×</span>
                  <span>Very expensive</span>
                </li>
                <li className="flex items-center gap-2 text-g400">
                  <span className="w-4 h-4">×</span>
                  <span>Long wait times</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-2 border-mint-400 p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-mint-400 text-navy-600 px-4 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold text-navy-600 mb-4">India via eCureTrip</h3>
              <div className="text-4xl font-bold text-health mb-2">$6,100</div>
              <p className="text-g600 mb-6">All-inclusive TKR package</p>
              <ul className="text-left space-y-2 text-sm text-g600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>World-class care</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>Escrow protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>87% cost savings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>Immediate availability</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-g200 p-8 text-center">
              <h3 className="text-2xl font-bold text-navy-600 mb-4">Other Countries</h3>
              <div className="text-4xl font-bold text-gold mb-2">$15,000</div>
              <p className="text-g600 mb-6">Average medical travel cost</p>
              <ul className="text-left space-y-2 text-sm text-g600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>Cost savings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-health" />
                  <span>Quality care</span>
                </li>
                <li className="flex items-center gap-2 text-g400">
                  <span className="w-4 h-4">×</span>
                  <span>No escrow protection</span>
                </li>
                <li className="flex items-center gap-2 text-g400">
                  <span className="w-4 h-4">×</span>
                  <span>Hidden fees common</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-600 to-sky">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Your Medical Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Get a personalized quote for your medical procedure with transparent pricing 
            and secure escrow protection. No hidden fees, no surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-navy-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-mint-400 transition-colors duration-200">
              Get Your Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-navy-600 transition-colors duration-200">
              View All Packages
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

