import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MRV Grocery Store",
  description:
    "Privacy policy regarding data collection and usage at MRV Grocery Store.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          Privacy Policy
        </h1>

        <p className="mb-8 text-gray-600 italic">
          Effective date: August 14, 2025
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1) Data Fiduciary (Controller) & Contacts
            </h2>
            <p>
              <strong>MRV Grocery Store</strong>, SHOP No. 11, APMC Yard,
              ARSIKERE, 573103, Karnataka, India, is the Data Fiduciary
              (controller) for personal data processed when you chat with us on
              WhatsApp or opt in to receive WhatsApp messages.
            </p>
            <p className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <strong>Privacy contact / Grievance Officer:</strong> Manager
              <br />
              <strong>Email:</strong> mrvstoresvps@gmail.com
              <br />
              <strong>Phone:</strong> +91 94481 32930
              <br />
              <strong>Address:</strong> SHOP No. 11, APMC Yard, ARSIKERE,
              573103, Karnataka.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              If we are designated as a “Significant Data Fiduciary”, our Data
              Protection Officer (DPO) contact will also be published here.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2) Personal Data We Process
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identification & contact:</strong> name, WhatsApp phone
                number, country.
              </li>
              <li>
                <strong>Order & service:</strong> order ID, items, delivery
                updates, support history.
              </li>
              <li>
                <strong>Messaging:</strong> content you send to us, timestamps,
                our responses.
              </li>
              <li>
                <strong>Technical:</strong> device/connection data provided by
                WhatsApp to businesses (limited to what WhatsApp shares).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3) Sources
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Directly from you (messages; forms/CTAs where you enter your
                number).
              </li>
              <li>
                Our ecommerce/order systems (to link your chat to your order).
              </li>
              <li>
                WhatsApp Business Platform (metadata necessary for delivery).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4) Purposes & Legal Bases under the Digital Personal Data
              Protection Act, 2023
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>
                  Order confirmations, status/delivery updates, customer support
                </strong>{" "}
                — performance of a contract or “legitimate use” for voluntary
                data you provide for a specified purpose; and/or consent where
                required.
              </li>
              <li>
                <strong>
                  Fraud prevention, security, and service analytics
                </strong>{" "}
                — legitimate interests in operating a safe and reliable service;
                you may object via our grievance channel.
              </li>
              <li>
                <strong>Marketing via WhatsApp</strong> — consent only. You can
                withdraw consent at any time (reply STOP/UNSUBSCRIBE).
              </li>
              <li>
                <strong>
                  Record-keeping, compliance with requests from authorities, and
                  defending legal claims
                </strong>{" "}
                — legal obligation/legitimate interests.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5) Consent Management
            </h2>
            <p>
              We request consent in clear and plain language and provide
              contacts for queries. Where applicable, you may
              give/manage/withdraw consent via a registered Consent Manager.
              Withdrawing consent does not affect past lawful processing; we
              will cease messaging that relies on consent within a reasonable
              time after withdrawal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6) Children
            </h2>
            <p>
              Our services are not intended for children under 18. Before
              processing any personal data of a child, we would obtain
              verifiable parental/guardian consent as required. We do not
              undertake tracking, behavioural monitoring, or targeted
              advertising directed at children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7) Cross-Border Transfers
            </h2>
            <p>
              We may transfer/process personal data outside India to service
              providers (including WhatsApp/Meta and cloud/IT vendors). Under
              the DPDP Act, transfers are permitted except to countries
              restricted by Government notification. We use contracts and
              safeguards with processors and share only what is necessary for
              the purposes in this Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8) Sharing Your Data
            </h2>
            <p>We may share limited data with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>WhatsApp/Meta (to send/receive messages)</li>
              <li>
                Logistics, payment, and customer-support vendors (to service
                your order)
              </li>
              <li>IT/hosting/CRM providers under data-processing contracts</li>
              <li>Authorities where required by law</li>
            </ul>
            <p className="mt-2 text-gray-700 font-medium">
              We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9) Retention
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Support & order-status chats:</strong> generally up to
                24 months after your last interaction, unless a longer period is
                required for legal obligations or disputes.
              </li>
              <li>
                <strong>Marketing consent records:</strong> while consent is
                active and up to 5 years after withdrawal for compliance proof.
              </li>
              <li>
                <strong>Order linkage data:</strong> retained in line with
                finance/tax retention schedules.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10) Your Rights (India — DPDP Act, 2023)
            </h2>
            <p>Subject to applicable law, you may:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Access a summary of your personal data being processed and the
                processing activities, and identities of Data
                Fiduciaries/Processors with whom data is shared.
              </li>
              <li>
                Request correction, completion, or updating of
                inaccurate/incomplete data.
              </li>
              <li>
                Request erasure where retention is not required for a specified
                purpose or by law.
              </li>
              <li>
                Lodge a grievance through our mechanism and escalate to the Data
                Protection Board of India if unsatisfied.
              </li>
              <li>
                Nominate another individual to exercise your rights in case of
                death or incapacity.
              </li>
            </ul>
            <p className="mt-2">
              To exercise rights, contact{" "}
              <strong>mrvstoresvps@gmail.com</strong> from your WhatsApp number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11) Security & Breach Notice
            </h2>
            <p>
              We implement technical and organisational measures (access
              controls, encryption in transit, staff training). In the event of
              a personal data breach, we will intimate the Data Protection Board
              of India and affected individuals in the form and manner
              prescribed by law, and take remedial steps.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12) India Consumer Grievances (E-commerce Rules, 2020)
            </h2>
            <p>
              We maintain a grievance redressal mechanism and appoint a
              Grievance Officer. We will acknowledge consumer complaints within
              48 hours and aim to resolve them within one month from receipt.
            </p>
            <p className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <strong>Grievance Officer:</strong> Manager
              <br />
              <strong>Email:</strong> mrvstoresvps@gmail.com
              <br />
              <strong>Phone:</strong> +91 94481 32930
              <br />
              <strong>Address:</strong> SHOP No. 11, APMC Yard, ARSIKERE,
              573103, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13) WhatsApp-Specific Disclosures
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                WhatsApp may process your data under its own terms/privacy
                policy.
              </li>
              <li>
                We respect WhatsApp’s 24-hour service window and use approved
                templates for business-initiated messages where required.
              </li>
              <li>
                You can always opt-out by replying STOP/UNSUBSCRIBE or blocking
                our number.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14) Changes
            </h2>
            <p>
              We will update this Policy as our practices or laws change. We
              will notify you of material changes when required. The latest
              version is available on our website/app.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
            <p>
              <strong>MRV Grocery Store</strong>
              <br />
              SHOP No. 11, APMC Yard, ARSIKERE, 573103, Karnataka, India
              <br />
              <strong>Privacy/Grievance:</strong> mrvstoresvps@gmail.com
              <br />
              <strong>Phone/WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/919448132930"
                className="text-blue-600 hover:underline"
              >
                +91 94481 32930
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
