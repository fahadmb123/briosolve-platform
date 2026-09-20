// @ts-nocheck
import React from 'react';

export default function Verification() {
  return (
    <>
<div className="app-content">
                
                <div className="verification-status-banner mb-6 p-4 rounded-lg flex items-center gap-4 bg-warning-light border border-warning" id="verification-banner">
                    <div className="status-icon bg-warning text-white rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div>
                        <h2 className="h5 mb-1 text-warning-dark">KYC Verification Pending</h2>
                        <p className="text-sm text-secondary mb-0">Please upload the required documents below to unlock your verified provider badge.</p>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-id-card"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Identity Document</h3>
                        <p className="text-xs text-secondary mb-4">Aadhaar Card, PAN Card, or Passport (Front &amp; Back)</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>

                    
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-file-contract"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Business Proof</h3>
                        <p className="text-xs text-secondary mb-4">Trade License, GST Certificate, or Shop Act</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>

                    
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Additional Credential</h3>
                        <p className="text-xs text-secondary mb-4">Vocational Certificates, Safety Training, etc. (Optional)</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-top">
                    <button className="btn btn-primary btn-lg" onClick={() => {}}>
                        <i className="fas fa-paper-plane mr-2"></i> Submit for Verification
                    </button>
                </div>

                
            </div>
        
    

    
    </>
  );
}
