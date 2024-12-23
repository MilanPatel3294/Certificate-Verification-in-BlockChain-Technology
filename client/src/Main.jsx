import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const { state: { contract, accounts } } = useEth();

  const [certificateData, setCertificateData] = useState({
    certificateId: "",
    uid: "",
    candidateName: "",
    courseName: "",
    organizationName: "",
    ipfsHash: "",
    cgpa: "",
    completionYear: "",
  });

  const [certificateDetails, setCertificateDetails] = useState(null);
  const [certificateId, setCertificateId] = useState("");

  const handleGenerateCertificate = async () => {
    const {
      certificateId,
      uid,
      candidateName,
      courseName,
      organizationName,
      ipfsHash,
      cgpa,
      completionYear,
    } = certificateData;

    try {
      await contract.methods
        .generateCertificate(
          certificateId,
          uid,
          candidateName,
          courseName,
          organizationName,
          ipfsHash,
          cgpa,
          parseInt(completionYear)
        )
        .send({ from: accounts[0] });
      alert("Certificate generated successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  const handleGetCertificate = async () => {
    try {
      const details = await contract.methods
        .getCertificate(certificateId)
        .call();
      setCertificateDetails({
        uid: details[0],
        candidateName: details[1],
        courseName: details[2],
        organizationName: details[3],
        ipfsHash: details[4],
        cgpa: details[5],
        completionYear: details[6],
      });
    } catch (error) {
      console.error("Error fetching certificate details:", error);
    }
  };

  const handleVerifyCertificate = async () => {
    try {
      const result = await contract.methods
        .verifyCertificate(certificateId)
        .call();
      if (result[0]) {
        alert("Certificate is valid!");
        setCertificateDetails({
          candidateName: result[1],
          courseName: result[2],
          organizationName: result[3],
          cgpa: result[4],
          completionYear: result[5],
        });
      } else {
        alert("Certificate is invalid or does not exist.");
        setCertificateDetails(null);
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
    }
  };

  return (
    <div id="App">
      <h1 className="title">Certification DApp</h1>
      <div className="horizontal-container">
        {/* Left Section */}
        <div className="left-section">
          <div className="card">
            <h2>Generate Certificate</h2>
            <form>
              {["Certificate ID", "UID", "Candidate Name", "Course Name", "Organization Name", "IPFS Hash", "CGPA", "Completion Year"].map((placeholder, index) => (
                <input
                  key={index}
                  className="input"
                  placeholder={placeholder}
                  onChange={(e) =>
                    setCertificateData({ ...certificateData, [placeholder.replace(/\s+/g, "").toLowerCase()]: e.target.value })
                  }
                />
              ))}
              <button className="button" onClick={handleGenerateCertificate}>
                Generate Certificate
              </button>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="card">
            <h2>Fetch Certificate</h2>
            <input
              className="input"
              placeholder="Certificate ID"
              onChange={(e) => setCertificateId(e.target.value)}
            />
            <button className="button" onClick={handleGetCertificate}>
              Fetch Certificate Details
            </button>

            {certificateDetails && (
              <div className="details">
                <h3>Certificate Details</h3>
                {Object.entries(certificateDetails).map(([key, value], index) => (
                  <p key={index}>
                    <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>
                    {value}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2>Verify Certificate</h2>
            <input
              className="input"
              placeholder="Certificate ID"
              onChange={(e) => setCertificateId(e.target.value)}
            />
            <button className="button" onClick={handleVerifyCertificate}>
              Verify Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComp;
