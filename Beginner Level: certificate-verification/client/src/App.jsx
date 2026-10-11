import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("issue");

  const [form, setForm] = useState({
    studentName: "",
    course: "",
    institution: "",
    issueDate: "",
  });

  const [issuedCertificate, setIssuedCertificate] = useState(null);
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function issueCertificate(e) {
    e.preventDefault();
    setLoading(true);
    setIssuedCertificate(null);
    try {
      const response = await axios.post(`${API_URL}/certificates`, form);
      setIssuedCertificate(response.data.certificate);
      setForm({ studentName: "", course: "", institution: "", issueDate: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Could not issue certificate");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCertificate(e) {
    e.preventDefault();
    if (!certificateId.trim()) return;
    setLoading(true);
    setVerificationResult(null);
    try {
      const response = await axios.get(
        `${API_URL}/certificates/${certificateId.trim()}`
      );
      setVerificationResult(response.data);
    } catch (error) {
      setVerificationResult({
        verified: false,
        message: error.response?.data?.message || "Certificate not found",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">CertiChain</div>

        <div className="nav-buttons">
          <button
            className={activePage === "issue" ? "active" : ""}
            onClick={() => {
              setActivePage("issue");
              setIssuedCertificate(null);
            }}
          >
            Issue Certificate
          </button>

          <button
            className={activePage === "verify" ? "active" : ""}
            onClick={() => {
              setActivePage("verify");
              setVerificationResult(null);
            }}
          >
            Verify Certificate
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="hero">
          <h1>Certificate Verification</h1>
          <p>
            Issue and verify certificates using blockchain-inspired records and
            hashing.
          </p>
        </div>

        {activePage === "issue" && (
          <section className="card">
            <h2>Issue Certificate</h2>

            <form onSubmit={issueCertificate}>
              <label>Student Name</label>
              <input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />

              <label>Course</label>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Enter course"
                required
              />

              <label>Institution</label>
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Enter institution"
                required
              />

              <label>Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
              />

              <button className="primary-button" disabled={loading}>
                {loading ? "Issuing..." : "Issue Certificate"}
              </button>
            </form>

            {issuedCertificate && (
              <div className="success-box">
                <h3>Certificate Issued</h3>
                <p>
                  <strong>Certificate ID:</strong>{" "}
                  {issuedCertificate.certificateId}
                </p>
                <p>
                  <strong>Hash:</strong> {issuedCertificate.hash}
                </p>
                <p>
                  <strong>Previous Hash:</strong>{" "}
                  {issuedCertificate.previousHash}
                </p>
                <p className="note">
                  Save the Certificate ID for verification.
                </p>
              </div>
            )}
          </section>
        )}

        {activePage === "verify" && (
          <section className="card">
            <h2>Verify Certificate</h2>

            <form onSubmit={verifyCertificate}>
              <label>Certificate ID</label>
              <input
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Example: CERT-A1B2C3"
                required
              />

              <button className="primary-button" disabled={loading}>
                {loading ? "Checking..." : "Verify Certificate"}
              </button>
            </form>

            {verificationResult && (
              <div
                className={
                  verificationResult.verified
                    ? "verification valid"
                    : "verification invalid"
                }
              >
                {verificationResult.verified ? (
                  <>
                    <h3>&#10003; Certificate Verified</h3>
                    <p>
                      <strong>Student:</strong>{" "}
                      {verificationResult.certificate.studentName}
                    </p>
                    <p>
                      <strong>Course:</strong>{" "}
                      {verificationResult.certificate.course}
                    </p>
                    <p>
                      <strong>Institution:</strong>{" "}
                      {verificationResult.certificate.institution}
                    </p>
                    <p>
                      <strong>Issue Date:</strong>{" "}
                      {verificationResult.certificate.issueDate}
                    </p>
                    <p>
                      <strong>Hash:</strong>{" "}
                      {verificationResult.certificate.hash}
                    </p>
                  </>
                ) : (
                  <>
                    <h3>&#10007; Verification Failed</h3>
                    <p>
                      {verificationResult.message ||
                        "The certificate could not be verified."}
                    </p>
                  </>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
