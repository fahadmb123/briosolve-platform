// @ts-nocheck
import React from 'react';

export default function Verification() {
  return (
    <>
<div className="app-content">
                {/*  Page Title  */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="h3 mb-1">Provider Verification Queue</h1>
                        <p className="text-secondary text-xs mb-0">Evaluate trade diplomas, municipal licenses, and government IDs prior to granting marketplace Verified badges.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary"><i className="fas fa-shield-alt text-primary mr-1"></i>Masked ID Storage Enabled</span>
                    </div>
                </div>

                {/*  Verification Pipeline Metrics  */}
                <div className="admin-kpi-grid" style={{"gridTemplateColumns":"repeat(auto-fit, minmax(200px, 1fr))"}}>
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-warning-light text-warning">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">18</div>
                            <div className="admin-kpi-lbl">Pending Review</div>
                        </div>
                    </div>
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-success-light text-success">
                            <i className="fas fa-check-double"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">2,890</div>
                            <div className="admin-kpi-lbl">Total Verified</div>
                        </div>
                    </div>
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-danger-light text-danger">
                            <i className="fas fa-ban"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">84</div>
                            <div className="admin-kpi-lbl">Total Rejected</div>
                        </div>
                    </div>
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-info-light text-info">
                            <i className="fas fa-stopwatch"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">4.2 hrs</div>
                            <div className="admin-kpi-lbl">Avg Review Turnaround</div>
                        </div>
                    </div>
                </div>

                {/*  Verification Queue Table  */}
                <div className="admin-table-card">
                    <div className="admin-table-header">
                        <div className="text-sm font-semibold text-text">Dossiers Awaiting Audit (18 Applications)</div>
                        <div className="text-xs text-muted">First-In First-Out (FIFO) Processing</div>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Applicant Specialist</th>
                                    <th>Trade Category</th>
                                    <th>Trade Experience</th>
                                    <th>Submission Timestamp</th>
                                    <th>Document Bundle</th>
                                    <th>Audit State</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://ui-avatars.com/api/?name=Pooja+Sharma&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Pooja" />
                                            <div>
                                                <div className="font-medium text-text">Pooja Sharma</div>
                                                <div className="text-xs text-secondary">CoolBreeze HVAC Care • Dadar, Mumbai</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-neutral">AC &amp; HVAC Repair</span></td>
                                    <td>6 Years Certified</td>
                                    <td>Today, 10:45 AM</td>
                                    <td><span className="badge badge-info"><i className="fas fa-paperclip mr-1"></i>3 Files</span></td>
                                    <td><span className="badge badge-pending">Under Initial Review</span></td>
                                    <td className="text-right">
                                        <button className="btn btn-primary text-xs py-1 px-3" onClick={() => {}}>Review Dossier</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://ui-avatars.com/api/?name=Kavita+Jadhav&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Kavita" />
                                            <div>
                                                <div className="font-medium text-text">Kavita Jadhav</div>
                                                <div className="text-xs text-secondary">PureSpark Sanitization • Vile Parle</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-neutral">Home Deep Cleaning</span></td>
                                    <td>4 Years Licensed</td>
                                    <td>Yesterday, 04:12 PM</td>
                                    <td><span className="badge badge-info"><i className="fas fa-paperclip mr-1"></i>2 Files</span></td>
                                    <td><span className="badge badge-pending">Pending Admin Check</span></td>
                                    <td className="text-right">
                                        <button className="btn btn-primary text-xs py-1 px-3" onClick={() => {}}>Review Dossier</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://ui-avatars.com/api/?name=Anand+Verma&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Anand" />
                                            <div>
                                                <div className="font-medium text-text">Anand Verma</div>
                                                <div className="text-xs text-secondary">Precision Plumbing Care • Chembur</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-neutral">Plumbing &amp; Sanitary</span></td>
                                    <td>8 Years Certified</td>
                                    <td>02 Mar 2025</td>
                                    <td><span className="badge badge-info"><i className="fas fa-paperclip mr-1"></i>3 Files</span></td>
                                    <td><span className="badge badge-pending">Pending Admin Check</span></td>
                                    <td className="text-right">
                                        <button className="btn btn-primary text-xs py-1 px-3" onClick={() => {}}>Review Dossier</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://ui-avatars.com/api/?name=Sunil+Gawande&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Sunil" />
                                            <div>
                                                <div className="font-medium text-text">Sunil Gawande</div>
                                                <div className="text-xs text-secondary">Gawande Electricians • Thane West</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-neutral">Electrical Installations</span></td>
                                    <td>11 Years Experience</td>
                                    <td>01 Mar 2025</td>
                                    <td><span className="badge badge-info"><i className="fas fa-paperclip mr-1"></i>4 Files</span></td>
                                    <td><span className="badge badge-pending">Under Initial Review</span></td>
                                    <td className="text-right">
                                        <button className="btn btn-primary text-xs py-1 px-3" onClick={() => {}}>Review Dossier</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src="https://ui-avatars.com/api/?name=Mohd+Iqbal&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Iqbal" />
                                            <div>
                                                <div className="font-medium text-text">Mohd Iqbal</div>
                                                <div className="text-xs text-secondary">WoodStyle Carpentry • Kurla</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-neutral">Carpentry &amp; Modular</span></td>
                                    <td>5 Years Experience</td>
                                    <td>28 Feb 2025</td>
                                    <td><span className="badge badge-info"><i className="fas fa-paperclip mr-1"></i>2 Files</span></td>
                                    <td><span className="badge badge-pending">Pending Admin Check</span></td>
                                    <td className="text-right">
                                        <button className="btn btn-primary text-xs py-1 px-3" onClick={() => {}}>Review Dossier</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        
    

    {/*  Verification Review Modal Dialog  */}
    <div className="admin-modal-overlay" id="reviewDossierModal">
        <div className="admin-modal" style={{"maxWidth":"600px"}}>
            <div className="admin-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-user-check text-warning"></i>
                    <h3 className="h6 mb-0">Review Provider Verification Dossier</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="admin-modal-body">
                {/*  Provider Meta Header  */}
                <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-md border mb-4">
                    <img id="dossierAvatar" src="https://ui-avatars.com/api/?name=Provider&amp;background=6B7C98&amp;color=fff" className="avatar avatar-md" alt="Avatar" />
                    <div>
                        <h4 className="h6 mb-0" id="dossierName">Pooja Sharma</h4>
                        <div className="text-xs text-secondary" id="dossierMeta">CoolBreeze HVAC • AC Repair • 6 Years</div>
                        <div className="text-xs text-muted" id="dossierEmail">pooja@example.com</div>
                    </div>
                    <span className="badge badge-pending ml-auto">Pending Review</span>
                </div>

                {/*  Document Checklist &amp; Masked Previews  */}
                <h5 className="text-xs font-semibold text-secondary uppercase mb-2">Uploaded Document Credentials</h5>
                
                <div className="doc-preview-box">
                    <i className="fas fa-id-card doc-icon"></i>
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-text">Primary Government Identity</div>
                        <div className="text-xs text-secondary mt-1" id="dossierGovId">Aadhaar (Masked)</div>
                    </div>
                    <span className="security-mask-chip"><i className="fas fa-shield-alt"></i>Masked</span>
                </div>

                <div className="doc-preview-box">
                    <i className="fas fa-certificate doc-icon" style={{"color":"#22C55E"}}></i>
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-text">Trade Qualification / Diploma</div>
                        <div className="text-xs text-secondary mt-1" id="dossierTradeDoc">ITI Technical Diploma</div>
                    </div>
                    <span className="badge badge-verified text-xs">Valid Cert</span>
                </div>

                <div className="doc-preview-box">
                    <i className="fas fa-store doc-icon" style={{"color":"#F59E0B"}}></i>
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-text">Supporting Business / Municipal Registration</div>
                        <div className="text-xs text-secondary mt-1" id="dossierSupportDoc">Shop Establishment Act</div>
                    </div>
                    <span className="badge badge-neutral text-xs">Workshop Verified</span>
                </div>

                {/*  Rejection Reason Field (collapsible)  */}
                <div id="rejectionField" className="mt-3 p-3 bg-danger-light border rounded" style={{"display":"none"}}>
                    <label className="form-label text-xs text-danger font-semibold mb-1">Specific Rejection Reason (Dispatched to Provider)</label>
                    <textarea className="form-control text-xs" id="rejectionReasonText" rows="2" placeholder="e.g. Uploaded trade certificate is expired or illegible. Please submit valid ITI diploma."></textarea>
                </div>
            </div>
            <div className="admin-modal-footer">
                <button className="btn btn-secondary text-xs mr-auto" onClick={() => {}}>Cancel</button>
                <button className="btn btn-danger text-xs" id="rejectBtn" onClick={() => {}}>
                    <i className="fas fa-times-circle mr-1"></i>Reject Application
                </button>
                <button className="btn btn-success text-xs font-semibold" onClick={() => {}}>
                    <i className="fas fa-check-circle mr-1"></i>Approve Verification
                </button>
            </div>
        </div>
    </div>

    {/*  Main JS &amp; Page Logic  */}
    </>
  );
}
